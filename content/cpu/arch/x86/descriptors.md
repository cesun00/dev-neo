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

