---
title: "Memorandum: ELF File Format"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- ELF
- Linux
- Unix
---

This article gives an overview of the ELF binary file format.

<!--more-->

## Overview

There are 4 types of ELF files (defined by `e_type` enum below), all sharing the same ELF layout in the following diagram,
with the exception that *ELF Relocatables* (`ET_REL`, i.e. `.o` files) don't have the program header table:

{{<figure src="./elf.drawio.svg" caption="ELF layout overview.">}}

The ELF specification:
- mandates that the ELF header must appear at the beginning of the file.
- allows arbitrary ordering and file offset of the PHT, SHT, and sections, although all known assemblers & linkers put the PHT (if present) immediately after the ELF header, and SHT before the end of the file.

## Data Types

The ELF specification defines 2 variants of ELF files, *ELF32* and *ELF64*, for delivering programs targeting 32-bit word-length CPU (e.g. protected mode x86/x86-64, ARM, etc) and 64-bit CPU (e.g. 64-bit mode x86-64, ARM64, etc).
ELF32 and ELF64 share most structure definitions and differ only by the size of pointers and file offset being 32 or 64 bits.

For most Linux distros, ELF-related structures are defined in the `/usr/include/elf.h` (from glibc).

Regardless of ELF32 or 64:
- `ELF*_Half` are 16-bit unsigned integers
- `ELF*_Word/ ELF*_Sword` are 32-bit unsigned / signed integers
- `ELF*_Xword/ ELF*_Sxword` are 64-bit unsigned / signed integers

```c
/* Type for a 16-bit quantity.  */
typedef uint16_t Elf32_Half;
typedef uint16_t Elf64_Half;

/* Types for signed and unsigned 32-bit quantities.  */
typedef uint32_t Elf32_Word;
typedef	int32_t  Elf32_Sword;
typedef uint32_t Elf64_Word;
typedef	int32_t  Elf64_Sword;

/* Types for signed and unsigned 64-bit quantities.  */
typedef uint64_t Elf32_Xword;
typedef	int64_t  Elf32_Sxword;
typedef uint64_t Elf64_Xword;
typedef	int64_t  Elf64_Sxword;

/* Type of addresses.  */
typedef uint32_t Elf32_Addr;
typedef uint64_t Elf64_Addr;

/* Type of file offsets.  */
typedef uint32_t Elf32_Off;
typedef uint64_t Elf64_Off;

/* Type for section indices, which are 16-bit quantities.  */
