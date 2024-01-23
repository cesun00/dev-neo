---
title: "Misc x86 Considerations"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

#### Implicit operands

Encoding operands is expensive. For example, Intel 8080 (and many other microprocessors of its age) encodes all instructions into 1 byte.
The `MOV` has an opcode of `01` and takes 2 register operands, which consumed the space `01xxxxxx` already. This leaves little room for other instructions. Later x86 CPUs do so for the same reason.

Using implicit operands, instead of allowing (specifying registers as) operands, makes programs compact.


### Alignment

It is recommended for maximum performance, but not mandatory, that words be aligned at even-numbered addresses and doublewords be aligned at addresses evenly divisible by four.

> When used in a configuration with a 32-bit bus, actual
> transfers of data between processor and memory take place in units of
> doublewords beginning at addresses evenly divisible by four; however, the
> processor converts requests for misaligned words or doublewords into the
