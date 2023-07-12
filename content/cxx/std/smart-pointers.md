---
title: "Smart Pointers"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

## When not to use smart pointer

Guideline:
- raw pointer with `new` expression is always bad.
- there are situation in modern C++ where raw pointers make perfect sense.

### when destruction of resources is potentially-throwing

Exception can't be thrown from deleter. Use classic RAII class with `noexcept(false)` public API and `noexcept(true)` dtor instead of smart pointer.

https://stackoverflow.com/questions/130117/if-you-shouldnt-throw-exceptions-in-a-destructor-how-do-you-handle-errors-in-i

RAII class should be kept simple: never own 2 resources in 1 class.
- [Microsoft guide mentioned this](https://docs.microsoft.com/en-us/cpp/cpp/how-to-design-for-exception-safety?view=msvc-170#keep-resource-classes-simple)
- (TODO: Bad things happends when RAII class wraps 2 resources?)

### Never use smart pointer to static memory

