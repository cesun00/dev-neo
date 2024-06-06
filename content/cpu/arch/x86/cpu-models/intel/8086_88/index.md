---
title: "Intel 8086 and 8088"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- x86
- CPU
---

Intel 8086 and 8088 differ only in the width of the memory data bus (thus pin assignment).
8086 has 20 address pins among which 16 are multiplexed as data pins;
8088 has also 20 address pins but only 8 are also data.

In almost every other respect the processors are identical;
software written for one CPU will execute on the other without alteration.

## Data Types

doublewords are only used to store pointers in 8086, with the lower-addressed word being offset, and the higher word being directly the physical address
of the segment base (there is no segment descriptor table yet).

## Modes

8086 has a MIN mode and a MAX mode controlled by the pin `MN/MX` that defines the function of 8 CPU pins in the 8086 and 9 pins in the 8088.

<!-- These modes are trivial and has nothing to do with the later modes  -->

## Memory

8086 has 20 address pins, supporting 1 MiB of physical memory.
This physical 

8086 doesn't support memory paging. Reference to a memory location appeared in a 8086 program will access.

- Unaligned word data is allowed, but doesn't take advantage of the 8086's ability to transfer 16-bits at a time.
- there is no alignment requirement for instructions.

segments must aligned on 16-byte (physical) memory boundary, and may be adjacent, disjoint, partially overlapped, or fully overlapped.

4 segment register CS / DS / SS / ES are available for code / data / stack / extra.

If there is no segment, program has to be written with absolute physical address. Such a program must be loaded at a fixed physical location
so that memory references don't get messed up. Of course if 2 existing program requires the same physical location at which itself are loaded,
they can't coexist at runtime. SHIT BRUH HERE WEGO

The solution is that, instead of using absolute physical address, all program refer to a memory location by its offset in a segment.
The segment can be loaded into any position in the physical memory space, and load its base physical address in one of the segment register.
Runtime address are computed by taking the `CS + offset` and compute
defer the computation of address to runtime - -- - -- - - ---