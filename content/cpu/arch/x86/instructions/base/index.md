---
title: "General Purpose x86 Instructions"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

A listing of GP x86 instructions, classified by functionality.

`opcode` will be used as the source of truth, as different assemblers and even the same assembler 
may have different mnemonics which translated to identical machine code.

## General Purpose data movement

## Stack Manipulation

## Integer Widening

## Integer Arithmetics

## Integer Comparison

## String Manipulation

These instructions manipulate a string of bytes, words, or doublewords.
All of them copy from `DS:[ESI]` (`ESI` offset into `DS` segment) to `ES:[EDI]` (`EDI` offset into `ES` segment).

The ones without `[BWD]` suffix can takes 2 memory address operands which can be very misleading, these operands only tell the intel assembler correct size of the item of copy to be 8/16/32-bit, and its address is simply ignored, and never get into the machine code.

 have zero-operand variatns with `[BWD]` suffixes, e.g. `MOVSB`, `STOSD`, etc. that respcets  This allows more compact programs to be written.
- `MOVS dest, src` (Move String):
    - `MOVSB` Move byte DS:[(E)SI] (overridable by a segment prefix)to ES:[(E)DI] (can't be overridden)
    - `MOVSW` Move word DS:[(E)SI] (overridable by a segment prefix)to ES:[(E)DI] (can't be overridden)
    - `MOVSD` Move dword DS:[(E)SI] (overridable by a segment prefix)to ES:[(E)DI] (can't be overridden)
- `CMPS` (Compare string):
- `SCAS` (Scan string):
- `LODS` (Load string):
- `STOS` (Store string):

The following prefixes can be applied as alternatives to an explicit loop structure:
- `REP` (Repeat while ECX not zero): 
- `REPE/REPZ` (Repeat while equal or zero): 
- `REPNE/REPNZ` (Repeat while not equal or not zero): 

## Bit Manipulation

## Jumps

## Interrupts

## System 



#### Verification of pointer parameters (refer to Chapter 6):
ARPL> -- Adjust RPL
