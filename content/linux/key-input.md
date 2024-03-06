---
title: "Linux keyboard input"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article explain how keyboard events are emits from hardware and delivered to userspace applications.

<!-- more -->

## Overview

1. Keyboard hareware sends *scancode* to kernel.
2. Kernel translates scancode to *keycode*.
3. *keyboard layout* defines the mapping from `(keycode, modifiers...)` tuple to *keysym*, which is either a printable character, or an action to carry out (e.g. volumn up /down/reboot).
4. *character set* (or charset) assigns each keysym symbol a specific number.

- key composition: in some language, typing 2 keys on the keyboard should produce a single accented letter.

## Models

### IBM PC keyboard

Keyboard's emission of scancode has a chaotic history due to the lack of standardization in the early days. Different PC and/or keyboard manufacturers, to different extends, invented their own scancode usage, and more or less become / affect the later standard.

A notable product line is keyboards under the name "Model F", packaged with IBM PC as a whole from 1981–1985.

### IBM Personal Computer (model 5150, abbr. IBM PC)

Released on August 12, 1981, the IBM PC is the 1st microcomputer released in the IBM PC model line and the basis for the IBM PC compatible de facto standard.

### IBM Personal Computer XT (model 5160, abbr. PC/XT)

Released on March 8, 1983, PC/XT is the 2nd computer in the IBM Personal Computer line.

The original release and later submodel 68, 78, 86, 87, 88, 267, 277 had a 83-key keyboard, part number 1501105 (UK layout) / 1501100 (US layout):

- https://en.wikipedia.org/wiki/IBM_Personal_Computer_XT#/media/File:Ibm_px_xt_color.jpg
- https://en.wikipedia.org/wiki/Model_F_keyboard#/media/File:IBM_Model_F_XT.png

It's scancode distribution become the later standard **scancode set 1**:

https://www.seasip.info/VintagePC/ibm_1501105.html

The XT keyboard has 83 keys, nicely numbered continuously 1-83, that is, with scancodes 0x01-0x53. No escaped scancodes.

Scancode emission corresponds to key down (a.k.a press or "make") and key up (a.k.a release or "break") events. Make code are given in the chart in the link above. Corresponding break code is obtained by setting the most sig bit, e.g. scancode `0x01` are send on `ESC` down and `0x81` on `ESC` up.

### IBM Personal Computer AT (model 5170, abbr. PC/XT)

Released on August 14, 1984, PC/AT is the 4th computer in the IBM Personal Computer line.

AT submodel 68, 99, 239, 319 came with an 84-key keyboard, whose scancode distribution become the later **scancode set 2**:

https://www.seasip.info/VintagePC/ibm_6450225.html

There is a single new key, with scancode 84 = 0x54, namely `SysRq`.

Also note how the scancode assignment differs drastically, e.g. left `ctrl` is `0x1D` in XT  but `0x14` in AT.

Old programs depends on scancode directly, and people realized that new scancodes would break them , so the keyboard output was fed to a 8042 microprocessor on the (keyboards's ? PC's?) motherboard that could translate Set 2 back into Set 1.

### IBM 3270 PC (model 5271) and IBM 3270 AT (model 5273)

IBM 3270 is a CRT terminal released in 1971.

Released in October 1983, IBM 3270 PC is an IBM PC XT containing additional hardware that, in combination with software, can emulate the behaviour of an IBM 3270 terminal. *It can therefore be used both as a standalone computer, and as a terminal to a mainframe.*

It's scancode distribution become the later standard **scancode set 3**:

https://www.seasip.info/VintagePC/ibm_6110344.html

### Exceptions

XT Submodels 89, 268, 278, 286 came with a 101-key keyboards. Essentially the IBM Model M, but in a modified variant that used the XT's keyboard protocol and lacked LEDs.

AT submodel 339 came with a 101-key keyboards.

## Scancode

The definition of scancode set boils down to a mapping from printed characters on the keycap to generated scancode on wire.

Nowadays (2022)

Although scancode set 1 originates from the 83-key XT keyboard

The majortiy of set 2 and 3 is rarely used, 

### typematic (a.k.a key repeat)

Most keyboards will repeat sending the keydown scancode when the key is held down. This behavior is known as "being typematic", and is allowed by the IBM PC standard.

https://encyclopedia2.thefreedictionary.com/typematic

### Ordinary scancode

Fancy "gaming" keyboards might have keys that emit scancode not recognized by the kernel.

Imagine a 16x16 square array of 256 keys with `[0x00, 0x7f]` and `[0xe000, 0xe07f]` printed on them.

### Escaped scancode

## Keycode

Dump the mapping by `getkeycodes`:

```
Plain scancodes xx (hex) versus keycodes (dec)
for 1-83 (0x01-0x53) scancode equals keycode

0x50:   80  81  82  83  99   0  86  87
0x58:   88 117   0   0  95 183 184 185
0x60:    0   0   0   0   0   0   0   0
0x68:    0   0   0   0   0   0   0   0
0x70:   93   0   0  89   0   0  85  91
0x78:   90  92   0  94   0 124 121   0

Escaped scancodes e0 xx (hex)

e0 00:    0   0   0   0   0   0   0   0
e0 08:    0   0   0   0   0   0   0   0
e0 10:  165   0   0   0   0   0   0   0
e0 18:    0 163   0   0  96  97   0   0
e0 20:  113 140 164   0 166   0   0   0
e0 28:    0   0 255   0   0   0 114   0
e0 30:  115   0 172   0   0  98 255  99
e0 38:  100   0   0   0   0   0   0   0
e0 40:    0   0   0   0   0 119 119 102
e0 48:  103 104   0 105 112 106 118 107
e0 50:  108 109 110 111   0   0   0   0
e0 58:    0   0   0 125 126 127 116 142
e0 60:    0   0   0 143   0 217 156 173
e0 68:  128 159 158 157 155 226   0 112
e0 70:    0   0   0   0   0   0   0   0
e0 78:    0   0   0   0   0   0   0   0
```

Keycode is in a relative small range. Kernel of common distros usually emit keycode from 1 to 255.

The result keycode is roughly numerically the same as scancode. For my linux thinkpad builtin keyboard, key `F` emits scancode `0x21` and produce keycode `33` (decimal), but USB external keyboard produce scancode `0x70009` and keycode `33`.

```
IF (SCANCODE MODE) {
    The kernel keyboard driver just transmits whatever it receives to the TERMIANL DRIVER when it is in scancode mode, like when X is running. 
} else {
    it parses the stream of scancodes into keycodes, corresponding to key press or key release events. (A single key press can generate up to 6 scancodes.)

    // regarding 
    if (KEYCODE MODE) {
        These keycodes are transmitted to the TERMIANL DRIVER directly (as used, for example, by showkey and some X servers).
    } else {
        Otherwise, these keycodes are looked up in the keymap, and the character or string found there is transmitted to the TERMINAL DRIVER, or the action described there is performed
    }
}
```

## Keyboard Layout & Charset

Keysyms are just names. For an exhaustive list of recognized names: `dumpkeys -l`.

### The keymaps (5) syntax

A line-oriented syntax for description of the kernel's translation rules from keycode to keysym.

this syntax effectively define a table where rows are keycodes and 256 columns are all possible combination of 9 modifiers using the binary composition/decomposition.

e.g. the 182-th column has index 181, to decompose: `181 = 10110101 b` = `CtrlR + ShiftR + ShiftL + Control + Shift`

Note that `CapsShift` has weight 256, which means it can't be used under normal configuration.

### Misc
- Line comment starts with `!` or `#`
- `\LF` join physical lines into one logical line.
- `include "path"` include other map file

### keycode

Main part of the syntax are blocks of:

```keymaps
keycode <keycode> = <keysym> <keysym> ... (up to 256 <keysym>s)
    <modifier> keycode = 
```

Modifers 


## Device Nodes for keyboard

For an exhaustive list of currently attached device:

```sh
$ cat /proc/bus/input/devices

...
I: Bus=0011 Vendor=0001 Product=0001 Version=ab83
N: Name="AT Translated Set 2 keyboard"
P: Phys=isa0060/serio0/input0
S: Sysfs=/devices/platform/i8042/serio0/input/input4
U: Uniq=
H: Handlers=sysrq kbd leds event4 
B: PROP=0
B: EV=120013
B: KEY=402000000 3803078f800d001 feffffdfffefffff fffffffffffffffe
B: MSC=10
B: LED=7
...
```

To read from that device driver:

```sh
sudo cat /dev/input/event4  | hexdump -C

# a single press `f`

00000000  07 4f 34 62 00 00 00 00  76 5d 03 00 00 00 00 00  |.O4b....v]......|
00000010  04 00 04 00 21 00 00 00  07 4f 34 62 00 00 00 00  |....!....O4b....|
00000020  76 5d 03 00 00 00 00 00  01 00 21 00 01 00 00 00  |v]........!.....|
00000030  07 4f 34 62 00 00 00 00  76 5d 03 00 00 00 00 00  |.O4b....v]......|
f00000040  00 00 00 00 00 00 00 00  07 4f 34 62 00 00 00 00  |.........O4b....|
00000050  e7 23 04 00 00 00 00 00  04 00 04 00 21 00 00 00  |.#..........!...|
00000060  07 4f 34 62 00 00 00 00  e7 23 04 00 00 00 00 00  |.O4b.....#......|
00000070  01 00 21 00 00 00 00 00  07 4f 34 62 00 00 00 00  |..!......O4b....|
00000080  e7 23 04 00 00 00 00 00  00 00 00 00 00 00 00 00  |.#..............|
```

To parse the output:

```python
#!/usr/bin/env python3

import struct
