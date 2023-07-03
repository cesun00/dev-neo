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
