---
title: "x86 Hardware Datatypes"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

A few data types are identified and directly supported by the CPU hardware for the convenience of document organization.

## Architectural Data Type {#data-types}

x86 is defined wrt. the following fundamental data types:
1. A byte is eight contiguous bits starting at any logical address. The bits are numbered 0 (the least significant bit) through 7 (the most significant bit)
2. A word is two contiguous bytes starting at any byte address. The bits of a word are numbered from 0 through 15; The byte containing bit 0 of the word is called the low byte; the byte containing bit 15 is called the high byte.
3. A `doubleword` is two contiguous words starting at any byte address. A doubleword thus contains 32 bits. The bits of a doubleword are numbered from 0 through 31; bit 0 is the least significant bit. The word containing bit 0 of the doubleword is called the low word; the word containing bit 31 is called the high word.