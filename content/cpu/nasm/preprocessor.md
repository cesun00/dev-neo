---
title: "Preprocessor"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- nasm
- assembly
- x86
---

## `%define` for single-line macro

## `%macro ... %endmacro` for multi-instructions macro

`%define` is not very useful when you need a macro that expands to multiple instructions. Use `%macro` for that:

```
%macro macro_name num_of_args [default args values]
    ; arguments are referred to by %1, %2, %3, etc.
    ; %0 expands to the number of arguments, a compile-time constant
%endmacro
```

where `num_of_args` takes the form `x-y`, meaning that at least `x` arguments must be provided


1. `-y` is optional, making this a fixed length macro that must be called with precisely `x` arguments.
2. `x`
and at most `y` arguments

A fixed length macro must be called with precisely required number of arguments.


e.g.

If `num_of_args` ends with a `+` symbol, this is a greedy macro:

```
%macro foo 2+
    mov rax, %1         ; %1 expands to the first argument 
    db %2               ; %2 expands to whatever text else
%endmacro

foo 42, "foo", "bar", "zoo"
```

If `num_of_args` is exactly `1-*`, this is a special macro where range access to parameters are allowed by a `%{x:y}` construct:

```asm
%macro mpar 1-*
    db %{3:5}
    db %{5:3}
    db %{-1:-3}
%endmacro

mpar 1,2,3,4,5,6        ; expands to
                        ; db 3,4,5
                        ; db 5,4,3
                        ; db 6,5,4
```

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

    ; exit the process with code 42
    linux_syscall 0x3c, 42
```

<!-- https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md -->

## conditional macro