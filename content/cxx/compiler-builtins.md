---
title: "Compiler Builtins / Intrisics"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C
- C++
- gcc
---

Most of these builtins translate to a single x86 instruction.

## bit manipulations

### count leading (most significant) 0

```c
int __builtin_clz (unsigned int)
int __builtin_clzl (unsigned long)
int __builtin_clzll (unsigned long long)
```

### count trailing (least significant) 0

```c
int __builtin_ctz (unsigned int)
int __builtin_ctzl (unsigned long)
int __builtin_ctzll (unsigned long long)

int __builtin_ffs (int x)
int __builtin_ffsl (long)
int __builtin_ffsll (long long)
```

### count occurrences of 1

```c
int __builtin_popcount (unsigned int x)
int __builtin_popcountl (unsigned long)
int __builtin_popcountll (unsigned long long)
```