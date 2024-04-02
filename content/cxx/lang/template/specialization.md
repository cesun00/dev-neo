---
title: "Template Specialization"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

*Specialization* allows a *complete different* template definition to be used when specific 1) template arguments, or 2) patterns of template arguments is provided.

1) is the case for both full and partial specialization
2) is more expressive, and is only the case for partial specialization.

Specialization embodies ad-hoc polymorphism of metaprogramming: the same template name (interface) works for different type by really having multiple templates definition. It resembles function overloads, and is the the metaprogramming counterpart of the latter in many ways.

## Full specialization

Full specialization allows a complete different template definition to be used when specific template arguments is provided.

All template types (function template / class template / variable template / etc.) can have full specialization.

Its syntax is landmarked by keyword `template` followed by an empty pair of `<>`, with exact template arguments upon which this specialization should be selected for, spelled after the unqualifed name of the primary template, in another pair of `<>`:

```c++
// function template - primary template
template <typename T, std::size_t N>
void foo() {
    std::printf("primary template - %s\n", __PRETTY_FUNCTION__);
}

// function template - full specialization
template <>
void foo<const int, 42>() {
    std::printf("full specialization - %s\n", __PRETTY_FUNCTION__);
}

int main() {
    foo<int, 42>();       // primary template - void foo() [with T = int; long unsigned int N = 42]
    foo<const int, 42>(); // full specialization - void foo() [with T = const int; long unsigned int N = 42]
}
```

## Partial Specialization (class template / variable template only)

Syntax:

```c++
template<partial-specialization-paramter-list>
class-key primary-template-name<template-argument-list> {
    // ...
}
```

where `template-argument-list` must contains at least 1 parameter from `partial-specialization-paramter-list`.
i.e. `template-argument-list` can't be already fully determined (that's the syntax for full specialization).

```c++
// class template - primary template
template <typename T, std::size_t N>
struct MyArray {
    int x = 42;
};

// class template - partial specialization
template <typename E>
struct MyArray<E, 42> {
    int y = 55;
};

// class template - full specialization
template <>
struct MyArray<int, 42> {
     int z = 121;
};

int main() {
    MyArray<double, 0> a;       // select primary template
    std::printf("%d\n", a.x);
    std::printf("%d\n", a.y);   // unknown y
    std::printf("%d\n", a.z);   // unknown z

    MyArray<std::string, 42> b; // select partial specialization <E,42>
    std::printf("%d\n", b.x);   // unknown x
    std::printf("%d\n", b.y);
    std::printf("%d\n", b.z);   // unknown z

    MyArray<int, 42> c;         // select full specialization<int,42>
    std::printf("%d\n", c.x);   // unknown x
    std::printf("%d\n", c.y);   // unknown y
    std::printf("%d\n", c.z);
