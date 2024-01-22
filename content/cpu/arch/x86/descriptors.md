---
title: "Descriptor Tables, Descriptors, and Selectors"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

Descriptor tables are memory-resident data structures understood and manipulated directly by the x86/x86-64 CPUs.
Such structures are used in both x86 protected mode and AMD64 Long mode.

This article serves as a reference to descriptor tables and descriptors, without going into too much detail on how they are used to implement various features of the CPU. Please see links to feature-specific articles for such details.

## Descriptor tables

A descriptor table is a list of items, each known as a descriptor.
A descriptor is always 8 bytes in size in protected mode. IA32e/Long mode introduced 16-byte TSS descriptors and call gates descriptors.
Different types of descriptors and their structure are discussed in [the next section](#descriptors).

A descriptor table itself resides in a memory segment, i.e. a continuous piece of linear-space memory of variable size.
See [this article]({{<ref "./memory/index.md">}}) for details of memory segmentation from the CPU's perspective.

### Global Descriptors table (GDT)

The `GDTR` register (introduced in Intel 80286) locates a descriptors table known as the Global Descriptors table (GDT).
It is a 40/48/80-bit register in real-address(16)/protected(32)/64-bit mode, and has the following structure:

```goat
 39/47/79                      15                 0
+-----------------------------------------------+
| base (24/32/64 bits)        | limit (16 bits) |         GDTR register
+-----------------------------------------------+
```

1. limit (bit 0 - 15): the size of the GDT in bytes, minus 1.

    This field is always 16 bits in size regardless of the CPU mode.

    The subtraction of 1 occurs since the max value of this field is 65535 while the GDT can be 65536 bytes in size.
    Given the size of descriptors, `limit + 1` is always a multiple of 8.

2. base: the base address where GDT starts
    - For 80286 there is no paging, and this is the 24-bit *physical address* where the GDT starts.
    - For the later CPU in the protected mode, this is a 32-bit address in the linear address space (i.e. before page translation). 
    - For AMD64 CPU in the Long Mode, this is a 64-bit address in the linear address space (i.e. before page translation)

The GDT holds various global descriptors visible to all tasks in the system, including
1. code and data segment descriptors for kernel (or other ring 0 software) code
2. LDT descriptors. Each locates an LDT for a specific protected mode task.
3. TSS descriptors. Each locates a TSS for a specific protected mode task. Only the GDT can hold TSS descriptors.
3. various gate descriptors

### Local Descriptors table (LDT)

A new register `LDTR` introduced in Intel 80286 locates a descriptors table known as the Local Descriptors table (LDT).
The `LDTR` has the following structure:

```goat
 55                39                       15             0
+---------------------------------------------------------+
| 16-bit selector | 24-bit base            | 16-bit limit |     LDTR register
+---------------------------------------------------------+
<--   visible  -->|<--              hidden              -->
```

Many registers have such 

Unlike the `GDTR`, only the selector part (the most significant 16 bits) is visible.

The hidden 40 bits are effectively used as cache for 

The content of LDTR, including the hidden bits,  is reloaded under the following circumstances:
1. when a task is created, i.e. ... TODO
2. when a task switch happens

### Interrupt Descriptors table (IDT)

## Descriptors

Descriptors are entries in descriptor tables.
A descriptor is always 8 bytes in size in protected mode.
IA32e/Long mode introduced 16-byte TSS descriptors and call gates descriptors.

The 5th byte, known as the *access byte*, determines the nature of this descriptor and thus must be parsed first by the hardware:

```goat
  7   6   5   4   3   2   1   0   
+-------------------------------+
| P | DPL   | S |  Type         |       the access byte
+-------------------------------+
```

Within the access byte, from the most significant bit:
1. `P` (present): indicates whether this descriptor describes a segment currently in memory.

    A virtual memory system swaps data between memory with hard drive to make room for large software.
    In the old days, this is done in the unit of segment. This bit flags whether the segment described by this descriptor
    is currently in memory. If not, i.e. `P=0`, this descriptor doesn't, meaning that the base and limit, freeing 
    most bits in this field available to software to bookkeep the whereabout of the missing segment on the hard disk.

    Nowadays such swapping is implemented in the unit of page, and segment-based swapping is simply abandoned,
    rendering this field unused.

2. `DPL` (Descriptor Privilege Level): an integer value of 0 to 3 indicates
    - the exact privilege level required to load this descriptor to the `CS / SS` register (unless the `C` - Conforming flag is set)
    - the minimum privilege level required to load this descriptor to the `DS / ES` register
3. `S=1` indicates this segment contains program code or data; `S=0` indicates that it is a control segment related to certain features of the CPU.
4. The interpretation of other bits depends on the type of descriptors.

### Segment descriptor

In very old Intel manuals, the phrase *segment descriptors* only refers to those with `S=1`.
Now the speech changes, since they fucking agreeeee that.

#### Code or Data Segment descriptor (`S=1`)

```goat
15                                                              7                                                               0
+-------------------------------------------------------------------------------------------------------------------------------+
| base 31 - 24                                                  | G     | D/B   | L     | AVL   |  limit 19 - 16                |
+-------------------------------------------------------------------------------------------------------------------------------+
| P     | DPL           |   S   |  Type                         | base 23 - 16                                                  |
+-------------------------------------------------------------------------------------------------------------------------------+
| base 15 - 0                                                                                                                   |
+-------------------------------------------------------------------------------------------------------------------------------+
| limit 15 - 0                                                                                                                  |
+-------------------------------------------------------------------------------------------------------------------------------+
```

This type of descriptor identifies a segment holding program code or data.

```goat
+-------------------------------+
| P | DPL   | 1 | TYPE      | A | Access byte
+-------------------------------+
                +-----------+
                | 1 | C | R |   type bits for executable segment
                +-----------+
                  Executable: an executable segment usually contains code, unless hacking
                      Conforming: setting to 1 also allow more privileged task to call code in this segment directly;
                          Readable: whether this segment is readable by ordinary data operation e.g. `MOV`;
                +-----------+
                | 0 | ED| W |   type bits for non-executable segment
                +-----------+
                  Executable:  a non-executable segment usually contains data / stack - unless hacking
                      Expand Down: whether the stack grows toward lower address
                          Writable: set 0 for read-only data segment; set 1 implies readable.
```

For a non-executable segment, `ED=1` indicates

A stack does not have to be expand-down: loading an `ES=0` segment descriptor into `SS` does not cause an exception.

#### System segment descriptors

1. Descriptor Table Descriptor

This type of descriptor identifies a segment holding another descriptor table.
Most often, such descriptors appear in the GDT and identify segments that hold LDTs of different tasks.


2. Task State Segment (TSS) Descriptor

Hardware task switches are not supported in IA-32e mode. However, TSSs continue to exist.


3. Gate Descriptors

```goat
+---------------------------------------------------------------+
| Access Byte   |   |   |   |   |   |   |   |   |   |   |   | x |
+---------------------------------------------------------------+
 15                      7                       0
+-----------------------------------------------+
|                                               |   6
+-----------------------------------------------+           ^
| ACCESS BYTE           | x |   |   |   |   |   |   4   increasing address
+-----------------------------------------------+
| destination selector 15-2             | x | x |   2
+-----------------------------------------------+
| destination offset 15 - 0                     |   0
+-----------------------------------------------+
```

Type:
- 4: Call Gate Descriptor
- 5; Task Gate Descriptor
- 6: Interrupt Gate Descriptor
- 7: Trap Gate Descriptor


A call gate normally specifies a subroutine at a greater privilege level, and the called routine returns via a `return` instruction.

A call gate descriptor may reside in either the GDT or the LDT, but not in the IDT.



Interrupt gates cause interrupts to be disabled; trap gates do not.
Trap and interrupt gates both require a return via the interrupt return (IRET) instruction.


## Selectors / segment registers / descriptor registers
