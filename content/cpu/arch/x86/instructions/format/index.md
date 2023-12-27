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
        - `CPUID.(EAX=07H, ECX=0):EBX.MPX[bit 14]` is set.
        - `BNDCFGU.EN` and/or `IA32_BNDCFGS.EN` is set.
        - When the F2 prefix precedes a near CALL, a near RET, a near JMP, a short Jcc, or a near Jcc instruction

<!-- Now you are here. Being Lock-free is a lie.
Just because your CPU lock the memory bus for a given address doesn't
,  or atomic instruction, with being lockless in the sense of no explicit use
of locking construct or  in high-level programming language. There.is No Real Lockless Thing. Lockless Is a Lie. shame on those person.
See [](TODO) and also memory chip fuck for detailsTODO. -->

2. Segment override or branch hint

    Explicitly specifies which segment register an instruction should use, thereby overriding the default segment-register selection used for that instruction.

    Segment override prefixes can't be used with any branch instructions, since `2E` and `3E` for `Jcc` instructions are used as branch hints:
    - `2EH`: CS segment override prefix
    - `36H`: SS segment override prefix
    - `3EH`: DS segment override prefix
    - `26H`: ES segment override prefix
    - `64H`: FS segment override prefix
    - `65H`: GS segment override prefix

    Branch hints are only permitted for the `Jcc` conditional jump instructions family.
    - `2EH`: Branch not taken
    - `3EH`: Branch taken

3. Operand-size override `66H`

    This prefix allows a program to switch between 16- and 32-bit operand sizes.
    Either size can be the default; Using the prefix selects the non-default size.

    Note that an operand of a memory reference is considered the word / dword data in memory,
    not the static displacement encoded in the instruction.
    The size of (which is specified by the `ModR/M` byte).

    For example (NASM flavor),
    - `INC DWORD [0]` encodes to `ff 05 00 00 00 00` which increases the 32-bit integer found at `offset=0` in the DS segment,  while
    - `INC WORD [0]` encodes to `66 ff 05 00 00 00 00` which does the same except that it only interprets the first 2 bytes.

    Regardlessly, the displacement is 4 bytes.

    Some SSE2/SSE3/SSSE3/SSE4 instructions and instructions using a three-byte sequence of primary opcode bytes
    may use 66H as a mandatory prefix to express distinct functionality.

    Other use of the 66H prefix is reserved; such use may cause unpredictable behavior.

4. Address-size override `67H`

    switches between 32-bit and 16-bit address generation.
    Either size can be the default; the prefix selects the non-default size.

    When operands for the instruction do not reside in memory, using this prefix may cause unpredictable behavior.

### Primary Opcode

Opcode specifies the operation performed by the instruction.
Some instruction encodes 3 more bits of opcode information into the `ModR/M` byte.
While such bits are all logically considered opcode, this field is called the primary opcode, and the 3 bits (`Reg/Opcode` field below) are known as
the extended opcode.

A primary opcode can be 1, 2, or 3 bytes in length. An additional 3-bit opcode field is sometimes encoded in the `ModR/M` byte.
Smaller fields can be defined within the primary opcode. Such fields define the direction of operation, size of displacements, register encoding, condition codes, or sign extension. Encoding fields used by an opcode vary depending on the class of operation.

- 1 byte opcode includes all `00` to `FFH` except a reserved `0FH`.
- 2 bytes and 3 bytes opcode always start with a `0FH` escape. Such instruction may have a mandatory prefix of (66H, F2H, or F3H), creating a 3 or 4 bytes encoding <!--, e.g. TODO-->

Note that different opcodes may, depending on the design of the assembler, be mapped to the same spelled instruction in the assembly source.

### `ModR/M` & `SIB`

The `ModR/M` byte, if present, specifies the registers and addressing mode to be used.
It has the following structure:

```goat
  7   6   5   4   3   2   1   0
+-------------------------------+
| Mod   | Reg/Opcode| R/M       |
+-------------------------------+
```

- `Mod` and `R/M`

    `Mod` gives the size of displacement:

    | Mod | displacement size                                  |
    |-----|----------------------------------------------------|
    | 00  | no displacement                                    |
    | 01  | 8 bit                                              |
    | 10  | 32 bit                                             |
    | 11  | there is no memory access, and operand is register |

    When Mod is not `11`, EA is specified as `[reg] + displacement`; `R/M` gives which register to be used as `[reg]`

    Otherwise, EA is simply  register, i.e. there won't be memory access.

    Mod is and 24 possible combinations of `Mod:R/M` designate 24 different ways an effective address can be synthesized.

    When `Mod=11`, 8 possible values of `R/M` select one of the 8 groups of registers.
    The 8 groups are:

    | R/M   | register group       |
    |-------|----------------------|
    | `000` | `EAX/AX/AL/MM0/XMM0` |
    | `001` | `ECX/CX/CL/MM/XMM1`  |
    | `010` | `EDX/DX/DL/MM2/XMM2` |
    | `011` | `EBX/BX/BL/MM3/XMM3` |
    | `100` | `ESP/SP/AH/MM4/XMM4` |
    | `101` | `EBP/BP/CH/MM5/XMM5` |
    | `110` | `ESI/SI/DH/MM6/XMM6` |
    | `111` | `EDI/DI/BH/MM7/XMM7` |

    Each group contains 5 registers of different sizes, i.e. 32, 16, 8, 64, or 128 bits in length.
    Within a selected group, the register to be used is determined by the operand size of the instruction.
    Any instruction that accepts a register operand has a default operand size, which can be overridden by the `66H` prefix.

- The `reg/opcode` field,
    - for instruction with 2 operands, this field designates the second operand which must be a register
    - otherwise, this field may be used to encode 3 more bits of opcode information.
<!-- - The `R/M` field can specify a register as an operand, or it can be combined with the `mod` field to encode an addressing mode -->

Someitmes The specification of register is encoded in the primary opcode instead of `R/M` field.
