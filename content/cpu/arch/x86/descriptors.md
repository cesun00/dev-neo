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
