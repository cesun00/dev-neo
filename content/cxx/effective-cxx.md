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
