---
title: "x86 / x86-64 Instruction Format"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
- assembly
---

This article describes the format of the x86 protected mode 32-bit instructions.


[Discussion of the 64-bit instruction format](#64-bit) will be built on the x86 one since they share a lot of structure in common.

Extensions to x86, including AVX, and SSE instructions,
all use the same structure except that an escape prefix is used to identify the extension.
<!-- See TODO for AVX and SSE format -->

<!--more-->

## Overview: 32-bit protected mode instruction format

An encoded instruction consists of the following components, among which only the `opcode` is mandatory.

{{<wide>}}

```goat
                                        |<-  address forming specifier                ->|
+-------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefixes      | primary opcode        | ModR/M                | SIB                   | displacement                  | immediate                     |
| (1 byte each) | (1, 2, or 3 bytes)    | (1 byte if present)   | (1 byte if present)   | (1, 2, or 4 byte if present)  | (1,2 or 4 bytes if present)   |
+-------------------------------------------------------------------------------------------------------------------------------------------------------+
                                            |                               |
                                            V                               V

                      7   6   5   4   3   2   1   0                   7   6   5   4   3   2   1   0
                    +-------------------------------+               +-------------------------------+
                    | Mod   | Reg/Opcode| R/M       |               | scale | index     | base      |
                    +-------------------------------+               +-------------------------------+
```

{{</wide>}}

x86 uses variable-length instructions.
An instruction can specify both computation and memory read/write, rendering x86 not a load-store architecture.

At most 1 memory reference can be encoded in an instruction:
There are register-register, register-memory, memory-register, and immediate-register/memory instructions;
However, memory-memory instruction is never a thing.

Many assemblers, including NASM, use a bracket-surrounded expression to specify this memory operand.

### The Boundary between `primary opcode` and `ModR/M` Is Frequently Broken for the Sake of Compact Encoding

#### `ModR/M[3:5]` is sometimes used as part of opcode.

In an encoded instruction, its `opcode` determines the operation, and the other bits encode the operand.
- For most instructions, its `opcode` is given in the `primary opcode` field.
- Some instructions only take a single memory operand, thus the use of the `ModR/M` byte can't be avoided.
  The fact that no register is involved makes the `ModR/M[3:5]` bit available for encoding extra bits of opcode.
  For such instructions, its `opcode` consists of both `primary opcode` field and the `Reg/Opcode` field of the `ModR/M` byte.

For example,
- `INC DWORD [0]` is `ff 05 00 00 00 00`

    `ModR/M = 0x05 = 0b 00 000 101`.
    `r/m = 101` indicates a 32-bit displacement, and `Reg/Opcode = 000` is an opcode extension to `ff` representing an `INC`.

- `DEC DWORD [0]` is `ff 0d 00 00 00 00`

    `ModR/M = 0x0d = 0b 00 001 101`,
