---
title: "Memo: Effective C++ (Scott Meyers, 2006)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

This is a memorandum on my walk through the Effective C++.
Most of these were written in Fall, 2020.
Sections that don't hold anymore for new C++11 and later are removed.

<!--more-->

## 7. make dtor virtual in ALL base classes

We only consider public inheritance here. Private and protected inheritance have their composition alternative.

## TLDR

Clang raises a warning if a class has virtual functions and non-virtual dtor (`-Wnon-virtual-dtor`).

For the library coder:
- if a class is designed to be a base class, make its dtor virtual anyway (regardless it having virtual functions or not)
- Otherwise, don't, for the sake of performance. Abusing `virtual` is as stupid as forgetting it.

For the client coder:
- Never inherit from a class whose dtor is not `virtual`.

## the longer

You are the library coder:

```txt
if (a class is designed to be a base class) {
    if (except the dtor, any member function is virtual) {
        make dtor virtual too
    } else {
        You are looking at a base class whose behavior is not meant to be overriden. TODO: I don't see good example of this for now.

        Making dtor of such base class
        1. virtual:      burden the performance when base class object is used on its own. Each instance now carries a useless vptr.
        2. non-virtual:  exposes client to the the danger of pointing to an derived class instance via base class pointer. Good API design makes it hard / impossible to use it wrong, but now you have to doc it and hope your user read the doc.

        Thta's a tradeoff. But I really think (2) is intolerable, while (1) is pre-mature optimization.

        Make dtor virtual as well.
    }
} else {
    A leaf class. Warn everyone in the doc, absolutely not to inhert from it.

    Make dtor non-virtual, for the sake of performance.
}
```

```c++
Base *p = new Derived;

// ~Derived() always calls ~Base() in its end no matter what.
// 
// Having virtual ~Base() ensures such chained destruction starts from appropriate bottom, not somewhere in the middle.
delete p;
```

# 15. Provide access to raw resources in resource-managing classes.



# 20. Prefer pass-by-reference-to-const to pass-by-value.

Scott mentioned the so-called *slicing problem*, which is essentially a misunderstanding about polymorphism in C++ which only happens via pointer or reference.

```c++
