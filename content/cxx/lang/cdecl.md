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

## a pointer to array vs. array of pointers

```c
int (*ptr_to_arr)[42];      // Pointer to an array
int *ptr_arr[42];           // Array of pointers.
```

## 2d Array on Heap

```c
/**
 * @brief 2D array malloc with compilation-time known size.
 *
 * The pointed value has type int[NCOL], meaning
 * that pointer arithmetic on arr_p will use
 * sizeof(int) * NCOL as a unit.
 * 
 */
#define NROW 10
#define NCOL 10
int (*arr_nd)[NCOL] = malloc(NROW * sizeof *arr_nd);
```

```c++
/**
 * @brief lvalue / rvalue Reference to a pointer
 */
void foo(std::FILE *&file, std::FILE *&&unique_file) {

}
```

## there is no array of / pointer to / reference to reference

```c++
// WRONG: syntax errors
int& a[3]; // error
int&* p;   // error
int& &r;   // error
```