---
title: "x86 Base Instructions"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

Quick reference for base x86 instructions as defined by intel 80386.
See other pages for x86 extensions and details on when and since which model they are introduced.

## Categorized Instructions

### Data Movement:
1. `MOV`: transfers a byte, word, or doubleword from the source operand to the destination operand.

    See also `MOVSX` and `MOVZX`

2. `XCHG` (Exchange): swaps the contents of two operands. When used with a memory operand, XCHG automatically activates the LOCK signal.

### Stack Manipulation:
1. `PUSH` / `PUSHA`
2. `POP` / `POPA`

### Data Type Widening

Sign extension of a narrow data type to a wider one;
