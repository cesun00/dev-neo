---
title: "Protected Mode / 64-bit Mode x86-64 Linux Calling Convention"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article discusses the de facto standard calling convention of x86-64 Linux, i.e. the one used by GNU GCC.

<!--more-->

Distinguishment are made between 
- function calls between between userspace code made via `call`
- function calls from userspace to kernel code
    - made via `int 0x80` for 32-bit protected mode 
    - made via `syscall` for 64-bit mode


## 32-bit, userspace calls, fixed-length parameter list

{{<columns>}}

### caller code

<--->

### callee code

{{</columns>}}

## 64-bit, userspace calls, fixed-length parameter list

## Variadic arguments function

## System Calls

64-bit kernel receive arguments to a syscalls via pure registers.

Before a `syscall` instruction:
- `rax` must stores the linux syscall number
