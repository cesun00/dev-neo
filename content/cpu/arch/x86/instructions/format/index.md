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
    `r/m = 101` indicates a 32-bit displacement, and `Reg/Opcode = 001` is an opcode extension to `ff` representing a `DEC`.

The Intel SDM documents this by a `/digit` syntax where `digit` is the value of `Reg/Opcode` from 0 to 7;
e.g. `FF /0` indicates that the `Reg/Opcode` field of `ModR/M` must be 0.

#### `primary opcode` field sometimes specifies a register (depending on your interpretation)

The boundary between operations and operands can be vague.

For example,
- `XCHG EAX, ECX` encodes to a single `91H` byte which belongs to the `primary opcode` field and gives the complete `opcode`; while
- `XCHG EBX, ECX` encodes to `87 d9` where `87` is the `primary opcode` (also complete opcode) and `d9` is the `ModR/M` identifying 2 registers as operands.

What this means from the designer's perspective is that:

> In addition to letting *exchanging a 32-bit register with doubleword from 32-bit register or memory* be an opcode (`87`) and
> giving 2 operands registers in other fields (`d9`), x86 instruction designers decided also to make *exchanging EAX with ECX* (`91`) an opcode.

In fact, all of the following are standalone opcodes:

| exchanging EAX with ... | opcode |
|-------------------------|--------|
| EAX                     | 90H    |
| ECX                     | 91H    |
| EDX                     | 92H    |
| EBX                     | 93H    |
| ESP                     | 94H    |
| EBP                     | 95H    |
| ESI                     | 96H    |
| EDI                     | 97H    |

Depending on one's interpretation, he can claim that either
- `Exchanging EAX with foo` is an operation and `foo` is the operand; or
- `Exchanging EAX with EAX/ECX/EDX/...` each is an operation and there is no operand.

The Intel SDM takes the first figure of speech: `Exchanging EAX with foo` is an operation with opcode `0b 1001 0xxx`, and 8 possible
choices of operand register are encoded in the least significant 3 bits of the `opcode` byte.

Such encoding is documented using a `<base> +rd` syntax where `<base>` is an integer in hex whose least significant 3 bits are 0 (i.e. either `?0` or `?8` in hexadecimal).
For example, "exchanging EAX with a 32-bit register" [is documented as `90 +rd`](https://www.felixcloutier.com/x86/xchg), indicating
that for all possible values of the least significant 3 bits of the opcode (i.e. 0 to 7), adding it with `90` obtains a different opcode that
adds `EAX` with a different register.
The least significant 3 bits of the last byte of `primary opcode` is sometimes referred to as the "reg field of the opcode".

Assigning frequently used instructions with shorter encoding makes programs more compact.
However, this reduces human-readability and makes documentation harder to write and understand.
Fortunately, it's only possible to encode a single register in the `opcode` byte,
and other operands must be either implied register (e.g. EAX) or an immediate.
Because of that, only a few frequently used forms of certain instructions employed such encoding.
They are:

| instruction name | base |
|------------------|------|
| `PUSH`           | 50   |
| `XCHG`           | 90   |
| `BSWAP`          | 0FC8 |
| `DEC`            | 48   |
| `INC`            | 40   |
| `MOV`            | b8   |
| `POP`            | 58   |

### Encoded Instructions (Binary) and Assembler Instructions (Text Lines) are Different Animals

From the assembler language's perspective, an instruction can have 0, 1, 2, or even 3 operands.
Intuitively, the `opcode` field should correspond to the instruction name (e.g. `MOV` / `XCHG` / etc) and define what the operation is,
and the other fields should give the operands;
but the previous discussion has shown that such ideal world doesn't exist, and it's sometimes hard to divide operation and operand:
`XCHG EAX, ?` is a 2-operand instruction but ends up assembled as a single byte;

The point is that one should not assume the structure of a written instruction to be preserved in its encoded binary.

#### Address Arithmetic Expression Isn't Real

Many assemblers support the `Mod=00/01/10` addressing mode (i.e. base + index + displacement) and `SIB` scaling-based addressing
(i.e. base + index * scale + displacement) using the syntax of an arithmetic expression.
For example, NASM encodes `INC DWORD [EAX+EBX*4+0x32]` to `ff 44 98 32`.

The point is that the arithmetic expression a programmer wrote instructs the assembler to generate the correct addressing mode
(encoded in the `ModR/M` byte) for the instruction, instead of making any arithmetic calculation happen like a high-level programming language does.
Also, a programmer has limited choices for all of the base, index, and scale:

{{<figure src="ea.png" caption="All possible mix-and-match of EA computation methods.">}}

Of course, CPU hardware eventually reads `ff 44 98 32` and computes the address in order to access the memory, and in that sense, the arithmetic does happen.

### Prefixes

The prefixes component is a sequence of modifiers to the instruction, one byte each. The order among prefixes doesn't matter.

There are 4 groups of prefixes in the protected mode. An instruction can have at most 1 prefix from each group, i.e. at most 4 prefixes.

The 4 groups are:
1. Lock and Repeat

    - `F0H`: the `LOCK` prefix, indicating a memory bus lock for the address mentioned in the instruction.
      This prefix is famous for implementing various so-called lock-free algorithms. For CPUs designed for a multi-socket motherboard,
      this prefix causes a special `LOCK` pin to become low-active thus informing other CPUs to not access the same address before the signal is
      canceled.

    Repeat prefixes apply only to string instructions (e.g. `MOVS`, `CMPS` etc.), causing the instruction to act on each element of the string;
    or input/output instructions;
    Use of the repeat prefixes with instructions other than these 2 types may cause undefined behavior.
    They are also mandatory for TODO instructions.
    - `F2H`: the `REPNE/REPNZ` (Repeat-Not-Zero) prefix.
    - `F3H`: `REP` or `REPE/REPZ` (Repeat) prefix.

    - `BND` prefix is also encoded using `F2H` if the following conditions are true:
