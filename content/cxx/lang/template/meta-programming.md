---
title: "C++ Metaprogramming"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Metaprogramming in C++ refer to the exercise of writting bool `constexpr` evaluated by the client compiler, such that correct template instantiation is eventually instantiated.

## check if `T` is not const or volatile

```c++
std::same_as<T, std::remove_cv_t<T>>
```

## Use `std::addressof` to take address of object

Work against overloaded `operator&`.

## Use `std::to_address` to get the address value of (smart / raw) pointers

```c++
#include <type_traits>
#include <memory>
#include <cstdio>

int main () {
    // std::toaddress
    // 1) work for both smart and raw pointer
