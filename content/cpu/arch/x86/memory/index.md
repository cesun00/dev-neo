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

