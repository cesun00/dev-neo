---
title: "Static Initialization Fiasco"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Static Initialization

TLDR: don't use non-pointer static variables at all.

Within a single translation unit, static variables are guaranteed to be initialized from top to bottom.
You can let the initializer of a static variable depend on a previous one, in a single translation unit:

```c++
static int foo = 42;                    // live in .data
static int bar;                         // live in .bss
static int zoo = foo + bar + 42;        // live in .data; compiler figuring out `bar` is compile-time constant and do the computation

static Foo foo;     // live in .data, ctor executed before `main()`; TODO: how ? .init? 
```

This is not true for static variables in different translation units. There is no standard way (and no compiler-specific way, afaik)
to ensure a specific execution order of static variables

This can happens in a more subtle way 

```c++
// File1.h
class A {
  void doSomething() {} 
