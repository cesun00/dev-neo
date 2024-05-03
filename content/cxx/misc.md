---
title: "Miscellaneous C++ consideration"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Ownership

Ownership of resources is the responsibility to destroy those resources at proper time.

In any design, resource owning class should follow RAII, and follow the Single Resonsibility Principle:
it shouldn't have any public API other than
- the 6 reasonable special member functions
- a raw resourece accessor, as described in scott's `Item 15: Provide access to raw resources in resource-managing classes.`

## use `make_(unique|shared)` helpers instead of smart pointer constructor


https://stackoverflow.com/a/22571331/8311608


Overload a operator as a non-member function and declare it as friend to grant access to internal data members
https://stackoverflow.com/questions/2828280/friend-functions-and-operator-overloading-what-is-the-proper-way-to-overlo


## `reference_wrapper`

## dynamic dispatch: `vptr` and `vtable`

A polymorphism class is a class containing at least 1 virtual function.
