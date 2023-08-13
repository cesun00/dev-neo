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
    2. an index register: can be `SI` or `DI`
    3. displacement: an immediate number

    *It is the mix and match of the presence of the 3 components that gives rise to the various addressing modes of x86.*

    The sum of these 3 components is known as the *effective address (EA) of the operand*.

The EA is interpreted as an offset from a base address.
The base address is obtained by left-shifting the value of the associated segment register by 4 bits.
The physical address (the bits sent over the 20-bit address bus) is calculated by `((selected segment register) << 4) + EA`.

```
segment     4 5 0 0
EA            F C 3 2
-------------------------
phy         5 4 C 3 2
```

There is no exception to the rules above. No memory access could circumvent this `base + offset (EA)` arithmetic regardless of the syntax.
Instructions like `MOV AX, [BX]` or `MOV AX, [40]` could be very confusing to beginners as if
they were using absolute address if no knowledge of the segmentation mechanism is priorly acquired.
What makes it worse is that Certain retrospection material, including Intel's programmer reference manual for later models,
> In this mode of operation, all memory addressing is performed in terms of real physical addresses.
which is absolutely totally wrong to absurdity. You . Never . PROGRAM . WITH

For 8086/8088, EA is computed by the execution unit (EU) when an instruction is decoded.
This value is then made available on an internal bus connecting the EU and the BIU (bus interface unit).
The BIU reads the selected segment register, shifts its value, and adds it with EA to get the physical address.

The term *segment* is really an illusion created by ...

The consequences of such memory segmentation are:
1. there are 4096 different combinations of `base + offset` to address any location in the physical memory.
2. Each segment is thus naturally aligned on a 16-byte boundary and is 64KiB in size.
3. Segments can thus be adjacent, disjoint, partially overlapped, or fully overlapped.

In retrospect, the biggest motivation for having segmentation at all is the insufficient register width.
Also, an implied segment base address reduces the size of each instruction,
since only the offset needs to be mentioned in each instruction.

There has long been criticism against this segmentation:
1. TODO

<!-- Memory segment is a weird solution indeed, and  - as you can see - not all CPU designs need it - at least not those whose # of address lines is equal to or less than the width of registers. I believe nowadays there is still  -->


<!-- The Intel folks actually [had a plan](https://stevemorse.org/8086history/8086history.doc)
to use an 8-bit shift to the segment register instead of the 4-bit, but this would allow a 24-bit memory space,
which is considered too large for its time. this would have forced segments to begin on 256-byte boundaries -->

### Addressing mode

It is the mix and match of the presence of the 3 components that gives rise to the various addressing modes of x86.

{{<include-html "addressing-mode.html">}}

Also, x86 never had such a thing as "immediate addressing mode" - in case you might be hearing it from some half-baked article.

The whole idea of addressing mode gets retired ...

## Segmentation v2, 80286

The Intel 80286 was released in 1982.
It still uses 16-bit registers, but the # of address lines increased to 24, supporting physical memory of up to 16 MiB.

2 modes of operations were introduced: real address mode and protected virtual address mode.
Switching between the 2 modes is done by setting/unsetting the `Protected Enabled (PE)` bit in the Machine Status Word (MSW) register.
The 80286, upon reset, works in Real Address Mode by default.

### Real Address Mode

The real address mode simply captures how 8086/8088 works.
A program written for 8086/8088 can be run on an 80286 in the real address mode without any modification.

<!-- and the 80286 is essentially a high-performance 8086  -->
<!-- The 4 segment registers were, still 16 bits. -->

The only noticeable

There are indeed new instruction that doesn't exist in 8086 and 80186 that can be executed in the real address mode of 80286.

A20 - A23 bits should not be used by program, though it doesn't hurt if those bits are not 0.
The memory controller will ignore them and ensure 0 is send over the address bus for the

### Protected Virtual Address Mode

In the Protected Virtual Address Mode, the term segment still refers to a piece of continuous memory,
but its base address is not directly indicated by the segment register, and its size can vary.

For a complete view, 2 important memory-resident data structures must be discussed first.

#### Global Descriptor Table (GDT) and Local Descriptor Table (LDT)

A new register, `GDTR` (Global Descriptor Table Register) is introduced.
It is a 40-bit register consisting of 2 components:

```
 39                      15                 0
+-----------------------------------------+
| base (24 bits)        | limit (16 bits) |         GDTR register
+-----------------------------------------+
