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
