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
