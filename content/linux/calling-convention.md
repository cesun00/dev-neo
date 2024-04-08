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
- `rdi`, `rsi`, `rdx`, `r10`, `r8`, `r9` stores the 1st, 2nd, ..., 6th arguments.

There is no syscalls that accepts more than 6 arguments.
Complex structures are passed to kernel via memory pointers.

```asm
; linux_syscall call_no, arg0, arg1, arg2, arg3, arg4, arg5
%macro linux_syscall 1-7 0,0,0,0,0,0

    mov rax, %1
    mov rdi, %2
    mov rsi, %3
    mov rdx, %4
    mov r10, %5
    mov r8, %6
    mov r9, %7
    syscall

%endmacro
    
    

SECTION .data
msg:    db `hello world\n`
msglen: equ $-msg

GLOBAL manbaout

SECTION .text
manbaout:
    ; write to stdout a string
    linux_syscall 1,1,msg,msglen

