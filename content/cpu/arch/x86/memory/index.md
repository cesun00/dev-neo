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
```

1. limit (bit 0 - 15): the size of the GDT in bytes minus 1.

    The subtraction occurs since the max value of this field is 65535 while the GDT can be 65536 bytes in size.
    Since each item of the GDT is 8 bytes, `limit + 1` is always a multiple of 8.

2. base (bit 16 - 39): the 24-bit *physical address* where the GDT starts.

    There is no paging in 80286, so the 24 bits in this field will be a real physical address.

    The author doesn't find any requirement for alignment. Obviously, aligning on an 8-byte boundary certainly helps.

The `GDTR` register is not accessible by ordinary data instructions.
2 dedicated instructions `LGDT` and `SGDT` are designed for that purpose, and should only be used during "Protected Mode initialization".
- `LGDT` (load GDT):
- `SGDT` (store GDT):

Subsequent alteration of the GDT base and size values by modifying GDTR is not recommended, though possible at the Ring 0 privilege level.

By the definition above, `GDTR`, thus, locates a data structure in the memory called the Global Descriptor Table (GDT), which is a list of *descriptors*.
A descriptor is always 8 bytes in size, and has the following format:

```
 15                      7                       0
+-----------------------------------------------+
| Reserved in 80286. Must be 0.                 |   6
+-----------------------------------------------+           ^
| ACCESS BYTE           |    Base 23-16         |   4   increasing address
+-----------------------------------------------+
| Base 15-0                                     |   2
+-----------------------------------------------+
| Limit 15-0                                    |   0
+-----------------------------------------------+
```

There are 2 types of descriptors: segment descriptors, and everything else.
- A segment descriptor, marked by `S=1` bit in the access byte, describes a piece of continuous memory, i.e. segment, that contains code or data of some real program.
- other descriptors have `S=0` and locate various data structures the CPU is aware of.

The fifth bit of the `ACCESS BYTE` is known as the `S` bit, and its value determines the type of this descriptor.

```
Access byte of a segment descriptor (S=1):
  7   6   5   4   3   2   1   0
+-------------------------------+
| P |  DPL  | 1 | TYPE      | A |
+-------------------------------+

Access byte of everything else (S=0):
  7   6   5   4   3   2   1   0
+-------------------------------+
| P |  DPL  | 0 | TYPE          |
+-------------------------------+
```

For a segment descriptor (S=1):
1. limit (16-bit): the size of the segment, in bytes,
2. base (24-bit): the base address of the segment. There is no paging in 80286, so this is the real 24-bit physical address, no shifting.
3. For the access byte, a value of `00H` or `80H` will denote "invalid"; otherwise:
    1. `A`: ACCESSED. A set bit indicates 
    2. `type`: segment type and access information.
    3. `DPL`: Descriptor Privilege Level. 
    4. `P`: Present. TODO

The first entry in the GDT must be filled with 0, indicating an invalid descriptor.
The first valid descriptor thus starts at offset 8.

[80286 is designed with support for multitasking.]({{<ref "../multitasking.md">}})
A Local Descriptor Table (LDT) is the task-specific equivalence of the GDT.
Each task has its own LDT, meaning that there will be multiple LDTs across the memory of the whole system,
while there is only a unique GDT shared by all tasks.

An LDT has an identical structure to the GDT, except that its first entry is also a valid descriptor.
The LDT of a task is located by the `LDTR` register, which is a 56-bit register of the following format:

```
 55                39                       15             0
+---------------------------------------------------------+
| 16-bit selector | 24-bit base            | 16-bit limit |
+---------------------------------------------------------+
```

Only the 16-bit selector part is visible to the program.
For each task, the `LDTR` register is only accessible via 2 special instructions `SLDT` and `LLDT`.
Loading a new value for `LDTR` automatically load the invisible base and limit part from ... TODO


But when context-switching occurs, the content of this register will be automatically altered to reflect
the location and size of the LDT of the active task.

2. segment v2 are the bookkeeping unit of many important attribute of the program
2. segment v2 are the bookkeeping unit of many important attribute of the program
2. segment v2 are the bookkeeping unit of many important attribute of the program
2. segment v2 are the bookkeeping unit of many important attribute of the program
2. segment v2 are the bookkeeping unit of many important attribute of the program
2. segment v2 are the bookkeeping unit of many important attribute of the program

#### segment registers

At anytime during the run of a program, 2 descriptor tables are viewable, `GDTR` and `LDTR`,

The old 4 segment registers, `CS / SS / DS / ES`, are now each 64-bit register in the Protected Mode, all of which have the following format:

```
 63                      47          39                                  15                      0
+-----------------------------------------------------------------------------------------------+
|   16-bit selector     | access    |  segment base address             | segment size          |
+-----------------------------------------------------------------------------------------------+
```

Further, the 16-bit selector has to following format:

```
+-----------------------------------------------------------+
|   index (13 bits)             | TI (1 bit) | RPL (2 bit)  |
+-----------------------------------------------------------+
```

However, only the selector part (i.e. the most significant 16 bits) is visible to programmers.
There is no way the rest 48 bits can be observed by a programmer, not even in ring 0.
They are implementation details and are only included in 80286's manual for explaining how segment selection works:

- A read from a segment register, e.g. `MOV AX, DS` moves only the selector part of `DS` into `AX`.
- When a write to a segment register occurs, due to either explicit data instructions like `MOV` or `POP` etc. or inter-segment `JMP` / `CALL` which implicitly changes the `CS`, the instruction only specifies the selector part of the segment register. The CPU will automatically load the lower 48 bits (6 bytes) from the `index`-th entry of
    - the GDT, if `TI` is 0
    - the Local Descriptor Table (LDT), if `TI` is 1

Once a descriptor (in either GDT or LDT) has been located by the aforementioned mechanics,
80286 checks to ensure it's a valid 8-byte segment descriptor, and copies 6 bytes from its beginning address, ignoring the high 2 reserved bytes.

> In effect, the hidden descriptor fields of the segment registers function as the memory management cache of the 80286.

<!-- The calculation of an effective address for a memory operand in an instruction stays the same.
The EA is still treated as an offset, taking  -->

The `index` of a segment selector loaded into a segment register might be 0, and in the case of `TI=0`, this indicates the invalid entry
at the beginning of the GDT. Such a selector is known as the null selector.
Loading the null selector into 
1. CS or SS register causes a general-protection exception (#GP) to be generated.
2. DS, ES (and for later FS and GS) does not trigger a CPU exception per se.
The exception occurs when trying to access an offset within this invalid segment.
This can be used as a technique to initialize unused data segment registers and check unintentional memory access in code.

TODO: `IDTR` (Interrupt Descriptor Table Register)

At the end of the day, a 24-bit physical address is generated in the protected mode from 6 bytes + 16 bits of information.
The cost made protection and task scheduling possible.

## Paging + Segmentation v3





---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------







`GDTR` and `IDTR` is a 40-bit register with 2 component:

`LDTR` is a 56-bit register with the
1. limit
2. base:
3.

The good old 4 segment register are actually 64-bit, with 16


Certain region in the physical memory is used to store the *segment descriptor table*.
Each item is known as a segment descriptor which has the following structure:

```
```

The value of a segment register now has the following format:

```
```

- `RPL` (bits 0 to 2):
- `TI` (table indicator, bit 3): is the , 0 indicate a GLT should be used, 1 task-local
- index (bits 3 to 15): the index into the GLT



### gloss

virtual address space (VAS) is

- virtual memory refers to the fact that the combination of main and external storage can be used as a single large memory. In such a system,
  the user can write large programs without worrying about the physical memory limitations of the system.
-


----------------


## Address

A memory location is referenced by instruction in the following way:
1. as immediate number interpreted as offset to the current

## Segment

A segment descriptor is a 64-bit structure

Segment descriptors are stored in either of two kinds of descriptor table:
- The global descriptor table (GDT)
- A local descriptor table (LDT)

## Dual Memory Perspectives

80386 supports 2 interpretations of the physical from among which a running program can:
1. In the "flat" model, program

    TODO

2. In the segmented model,

    A complete pointer in this model consists of 2 parts:
    1. a 16-bit segment selector selects a segment. During execution of a program, the processor associates with a segment selector the physical address of the beginning of the segment.
    2. a 32-bit offset value gives the offset of the designated address into the selected segment.

    This model allows programs to be written without worrying that relocation at runtime mess up the address when referring to address in the same segment. since all address are relative offset to the segment.
    Inter-segment reference however does become a problem.



<!-- ## Address Translation