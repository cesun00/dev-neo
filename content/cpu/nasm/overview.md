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

- `BITS [16|32|64]`

    Explicitly specify the target processor mode, characterized by the GP register size.
    If not present, the target processor mode will be inferred from the target object file, e.g. `-f elf32` implies a `BITS 32`.

    Spelling `BITS 16` is useful for generating 8086-compatible machine code.



### Pseudo instructions

Nasm provides a few directives which don't map to real CPU instruction.
Instead they are used to define storage space, introduce compile-time constants,

The current pseudo-instructions are

DB, DW, DD, DQ, DT, DO, DY and DZ;
their uninitialized counterparts
RESB, RESW, RESD, RESQ, REST, RESO, RESY and RESZ;

the INCBIN command, the EQU command, and the TIMES prefix

### syscalls

The first six integer or pointer arguments are passed in registers RDI, RSI, RDX, RCX, R8, R9

User-level applications use as integer registers for passing the sequence %rdi, %rsi, %rdx, %rcx, %r8 and %r9.
The kernel interface uses %rdi, %rsi, %rdx, %r10, %r8 and %r9.