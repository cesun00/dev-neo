---
title: "Spell That Declaration Correctly!"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C
- C++
- Programming Language
---

## Don't mix pointers and non-pointers in the same declaration

```c
// do
int *ptr_a, *ptr_b;
int c;

// don't
int* ptr_a, b;
```


## pointer to const vs. const pointer

```c
const int *ptr_a;	// pointer to const
int *const ptr_b;	// const pointer; Recommended: asterisk preceeds const immediately
```

