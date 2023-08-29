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

