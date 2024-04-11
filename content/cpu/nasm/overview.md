---
title: "Overview to The Netwide Assembler"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- nasm
- assembly
- x86
---

NASM is an assembler for x86 and AMD64 architecture.

## CLI invocation

```sh
nasm -f FORMAT -o OUTPUT_FILE source.asm
```

`nasm` assembles each `.asm` file to an object file, which is later linked by a linker e.g. GNU `ld`.
See `nasm -h` for a list of supported `FORAMT`. For modern *NIX you almost always want to use `-f elf64`.
If `-o` is not specified,

## Programming

nasm is line oriented. The precense of `LF` in the source is significant for a successful assembling.

A logical line contains multiple
Each physical lines that ends 

Each line conforms to the following syntax:

```asm
label:  instruction operands    ; comment
```

1. `label` and the colon after is optional
2. 

###

The concept of a writing cursor is important when programming with nasm.

### addressing

```nasm
; registers are nominated by simple register names
; integer literals are 
mov rax, 1      ; move literal

; memory addresses are nominated by label name
mov rax, foo

; dereferencing (i.e. get content at a memory address) is done by surround address with a pair of []
mov rax, [foo]

; segment + offset addressing is done by
mov [es:bx], ax
```

### string literals

- backquote supports the following escape sequence

    `\’`        single quote (’)
    `\"`        double quote (")
    `\‘`        backquote (‘)
    `\\`        backslash (\)
    `\?`        question mark (?)
    `\a`        BEL (ASCII 7)
    `\b`        BS (ASCII 8)
    `\t`        TAB (ASCII 9)
    `\n`        LF (ASCII 10)
    `\v`        VT (ASCII 11)
    `\f`        FF (ASCII 12)
    `\r`        CR (ASCII 13)
    `\e`        ESC (ASCII 27)
    `\377`      Up to 3 octal digits - literal byte
    `\xFF`      Up to 2 hexadecimal digits - literal byte
    `\u1234`        4 hexadecimal digits - Unicode character
    `\U12345678`        8 hexadecimal digits - Unicode character

- single-quote and double-quote are equivalent and they define verbatim string. No escape sequence is recognized.


### NASM directives

