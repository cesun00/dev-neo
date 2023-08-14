---
title: "AMD64 Architecture and Assembly"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

This section holds x86 and AMD64 architectural information, rather than focusing on a specific CPU vendor/implementation.

## Architectural Data Type {#data-types}

In addition to the [x86 data types]({{<ref "">}}#data-types), the followings are defined:
1. quadword
2. double quadword

## Mode of Operation

An AMD64 architecture CPU runs in one of the 2 modes:
1. Legacy mode

    The purpose of legacy mode is to preserve binary compatibility with existing x86 applications / operating systems.

    Legacy mode consists of the following three sub-modes:
    1. Protected Mode—Protected mode supports 16-bit and 32-bit programs with memory segmentation, optional paging, and privilege-checking. Programs running in protected mode can access up to 4GB of memory space.
    2. Virtual-8086 Mode—Virtual-8086 mode supports 16-bit real-mode programs running as tasks under protected mode. It uses a simple form of memory segmentation, optional paging, and limited protection-checking. Programs running in virtual-8086 mode can access up to 1MB of memory space.
    3. Real Mode—Real mode supports 16-bit programs using simple register-based memory segmentation. It does not support paging or protection-checking. Programs running in real mode can access up to 1MB of memory space

    If you have experience with earlier x86 models e.g. intel 80386, these sub-modes should be familiar.

2. Long mode: consists of the following 2 sub-modes:
    1. 64-Bit Mode
    2. Compatibility Mode

## Assemblers

x86 assembler syntax comes in 2 flavors: 
- intel syntax; including variants: nasm, masm
- ATT: the current most popular implementation is the GAS (gnu assembler)

Among others, they mainly differs by the operand order: intel put destination operand first:  `mnemonic	destination, source`, but ATT put source operand first `mnemonic	source, destination`.

`objdump -d` prints ATT style by default. Add `-Mintel` to print in intel style.