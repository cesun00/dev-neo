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
> appropriate sequences of requests acceptable to the memory interface. Such
> misaligned data transfers reduce performance by requiring extra memory
> cycles.

There is no requirement for instructions to be aligned on word or
doubleword boundaries. (However, a slight increase in speed results if the
target addresses of control transfers are evenly divisible by four.)

## Glossary

- virtual memory: this phrase originally refers to the practice of temporarily moving unused data from main memory to the hard drive to make room for active software that requires large memory resources. For 80286 the unit of such swap is a segment, since demand-page is not implemented for that CPU.
However For all later models. The phrase *virtual memory* has nothing to do with the isolation of the address space between each process.

- demand-paging: ; such a system is said to be demand-paged.
- linear address space / processor's (addressable) memory space / processor's address space
- canonical address: In 64-bit mode, an address is considered to be in canonical form if address bits 63 through to the most-significant
implemented bit by the microarchitecture are set to either all ones or all zeros.

```
  63  ...    48   47
+---------------------------+
| 0 | ....  | 0 | FC5E ...  |
+---------------------------+
```


## MISC
