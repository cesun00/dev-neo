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
}
```

The sole purpose of `partial-specialization-paramter-list` is to introduce template parameters (as valid placeholders) in this specialization. It won't change the template's interface to clients, e.g. won't allow you to pass less / more number of template argument upon instantiation whatsoever. Client must always respect the interface of primary template (i.e. number of / type-or-non-type-ness of template parameter), regardless of whether primary template or any specialization will be used.

## Ordering among specializatoins (specialization resolution)

When a class or variable template is instantiated, and there are partial specializations available, the compiler has to decide if the primary template is going to be used or one of its partial specializations. This process feels like function overloads resolution, and is known as (TODO)

## pattern-based specialization resolution

Partial specialization are more expressive, in that it allows a specialization to be selected due to arguments satisfying certain traits, or exhibits certain patterns, rather than being a specific concrete type, compared to full specialization:

```c++
// primary template
template<typename T>
struct Foo {
    Foo() {std::puts("Foo primary template");}
};

// partial specialization selected when T is a (possibly cv-qualified) pointer
template<typename E>
struct Foo<E*> {
    Foo() {std::puts("Foo partial specialization for pointer");}
}; 

// primary template
template<typename T, typename E>
struct Bar { int x; };

// partial specialization selected when T == E
template<typename G>
struct Bar<G,G> { int y; };

int main() {
    Foo<int> f0;            // Foo primary template
    Foo<int*> f1;           // Foo partial specialization for pointer
    Foo<const int*> f2;     // Foo partial specialization for pointer

    Bar<int,double> a;          // hits primary Bar
    std::printf("%d\n", a.x);
    std::printf("%d\n", a.y);   // error: struct Bar<int, double>’ has no member named ‘y’

    Bar<int, int> b;            // hits T = E specialization
    std::printf("%d\n", b.x);   // error: ‘struct Bar<int, int>’ has no member named ‘x’
    std::printf("%d\n", b.y);

    Bar<double, double> c;      // hits T = E specializatoin
    std::printf("%d\n", c.x);   // error: ‘struct Bar<double, double>’ has no member named ‘x’
    std::printf("%d\n", c.y);
}
```


Misc
===========

## Source order between specializations and instantiations

Specialization must be declared before the first (explicit or implicit) instantiation, in every translation unit.

```c++
template<class T> // primary template
void sort(std::vector<T>& v) { /*...*/ }

