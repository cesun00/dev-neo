---
title: "Evolution of x86 Memory Organization"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

The physical memory, for all CPU designs, can always be modeled as a flat continuous byte array.
Ultimately, the CPU talks to the external memory module through the memory bus,
and the physical memory - the "flat" space can be scanned through by incrementing the numeric value on the address bus - no magic.

<!--more-->

## programming with physical addresses

Very early microprocessor models e.g. Intel 8080/8085, exposed this physical memory space directly to program instructions.

The 8080/8085 instruction set is encoded with at most 3 bytes.
The opcode and register specification is always 1 byte, leaving at most 2 bytes for immediate operands.
These models have 16 address lines, making it ideal to encode a memory address as an immediate operand.

Assembly code does one of the following when referring to a memory location:

1. directly spell physical address as an immediate operand in the instruction.

    This is either done by hardcoding an immediate number operand or using a label that is replaced with the computed address by the assembler.
    Both methods generate the same code, but most times it is either impossible or meaningless for a programmer to compute an address and then hardcode it.

    e.g. An `SHLD 0x0055` stores the content of the `HL` register pair to the physical memory address `0x0055`, or
    a `JMP foo` jump to whatever address the label `foo` resolved to.

2. dereference a register pair

    For memory addresses computed at runtime and stored in registers, dedicated instructions are used to provide read/write access.

    The 8080/8085 has 16 address lines but its registers are 8 bits in width.
    To address the whole memory space, registers `B` and `C`, `D` and `E`, `H` and `L`, are combined to form 3 16-bit register pairs.

    For example, a `STAX [BC|DE|HL]` interprets the content of the given 16-bit register pair as an absolute physical address and
    stores the value of the `A` register to that location.



## Segmentation v1, and Why

The 8086 and 8088 have 20 address pins supporting 1 MiB of physical memory, but their register is only 16 bits.
There is no virtual memory and paging yet, so we are still working with physical memory - the flat array - directly.

The instruction set was redesigned, which makes sense - obviously, nobody wanted to stick with the 1-byte encoding.
Again instructions can refer to memory locations either known at assembly time or must be computed at run time.

But this time, spelling physical addresses as immediate operands simply didn't make its way into the new design:
1. encoding a 20-bit immediate into an instruction inevitably wastes 4 bits per operand;
2. the static nature of the immediate operand makes it inflexible; there is no virtual memory yet, and a program with absolute addresses as immediate operands expects itself to be loaded at a specific memory location. Two such programs thus can't be loaded at the same time. Given the 1MiB memory which is considerably huge contemporarily, this is a waste of memory.
3. Meanwhile, everything done with an absolute address immediate operand can be achieved by first loading the address into a register then playing with that register.
4. introducing more complexity into the instruction set, costing more circuitry than the Intel folks were willing to pay, etc.

Anyway, absolute address immediate operands are gone forever.

Designers and programmers were facing a situation where they had to use 16-bit registers to address the 20-bit address space.
Instead of using the good old way inherited from 8080/8085 of concatenating 2 registers, a rather weird solution was devised,
known as memory segmentation:

1. 4 new registers were introduced, known as the segment registers: `CS / SS / DS / ES`.
2. Each instruction that accesses memory is associated with an implicit segment register.

    For example, a `MOV` from/to memory is implicitly associated with `DS`.

<!-- | instruction category | default register | allowed override to |
-----|----------------------|------------------|---------------------|----
     |                      |                  |                     | -->

    Most such instructions also allow overriding the default segment with an instruction prefix.
    e.g. `MOV AX, [4]` encodes to `a1 04 00` but `MOV AX, [CS:4]` encodes to `2e a1 04 00`; the `2e` prefix
    tells the CPU to use the `CS` segment register instead of the default `DS` for `MOV`.

    Also note that different assemblers may allow different syntax for such segment override.
    e.g. All of `CS MOV AX, [4]`, `CS MOV AX, [4]`, and `MOV AX, CS:[4]` generate identical instructions in NASM.

3. Each instruction that accesses memory can have at most 1 memory operand, i.e. an operand that references a memory location (instead of the value of a register or immediate number).

    This memory operand consists of 3 components, all of which are optional:
    1. a base register: can be `BX` or `BP`
