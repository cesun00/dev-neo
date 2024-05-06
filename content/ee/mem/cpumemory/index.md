---
title: "Memo: What Every Programmer Should Know About Memory"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- memory
---

This is a memo for Ulrich Drepper's *What Every Programmer Should Know About Memory*

https://people.freebsd.org/~lstewart/articles/cpumemory.pdf

Naming
------------
Unit: 
- GT/s: gigatransfer per seconds, i.e. billion or 10^9
- MT/s: megatransfer per seconds, i.e. million or 10^6

DDR4-2666 means a DDR4 SDRAM chip is around 2666.67 MT/s.

Most commercial MM mounts 8 x8 chips per rank in order to provide a 64 bit global data bus. If the chip mounted is DDR4-2666, the whole module is named PC4-21300, because each transfer is 64 bits = 8 bytes, and 2666.67 * 8 = 21333.36 MB/s.

DDR4 SDRAM spec JESD79-4 further divide chips of the same frequency into speed bin:

```
Speed Bin	DDR4-2666T	DDR4-2666U	DDR4-2666V	DDR4-2666W
CL-nRCD-nRP	17-17-17	18-18-18	19-19-19	20-20-20
...
```

The last letter refers to performance, and the same letter means the same CL-nRCD-nRP even if the frequency is different.
