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

