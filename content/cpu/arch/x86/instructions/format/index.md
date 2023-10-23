---
title: "x86 / x86-64 Instruction Format"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
- assembly
---

This article describes the format of the x86 protected mode 32-bit instructions.


[Discussion of the 64-bit instruction format](#64-bit) will be built on the x86 one since they share a lot of structure in common.

Extensions to x86, including AVX, and SSE instructions,
all use the same structure except that an escape prefix is used to identify the extension.
<!-- See TODO for AVX and SSE format -->

<!--more-->

## Overview: 32-bit protected mode instruction format

An encoded instruction consists of the following components, among which only the `opcode` is mandatory.

{{<wide>}}

```goat
                                        |<-  address forming specifier                ->|
+-------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefixes      | primary opcode        | ModR/M                | SIB                   | displacement                  | immediate                     |
| (1 byte each) | (1, 2, or 3 bytes)    | (1 byte if present)   | (1 byte if present)   | (1, 2, or 4 byte if present)  | (1,2 or 4 bytes if present)   |
+-------------------------------------------------------------------------------------------------------------------------------------------------------+
                                            |                               |
                                            V                               V

                      7   6   5   4   3   2   1   0                   7   6   5   4   3   2   1   0
