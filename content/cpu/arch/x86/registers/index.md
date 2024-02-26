---
title: "x86 Architectural and Model Registers"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

## General Purpose Registers

In 32-bit protected mode: EAX, EBX, ECX, EDX, EBP, ESP, ESI, and EDI.

## The Flags Register `EFLAGS`

This is a 32-bit register even for the AMD64 machine.
    
The following bits in the flag register are updated by most arithemtic operations unless otherwise noted:
- `CF`: carry flag; indicates whether a previous addition produces carry or a previous subtraction produces borrow.
- `OF`: overflow; 
- `SF`: sign flag
- `ZF`: zero flag
- `AF`: auxiliary carry
- `PF`: parity flag

## The instruction pointer register (EIP)

### Stack registers

stack pointer (ESP) register.
stack-frame base pointer (EBP) register.

The following instruction works by directly manipulation the stack registers:
1. 

## segments

<!-- The central idea of the segment model is that, instead of using absolute physical address, -->
