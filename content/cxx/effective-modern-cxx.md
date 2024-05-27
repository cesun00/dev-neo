---
title: "Memo: Effective Modern C++ (Scott Meyers)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

This is a memorandum on my walk through the Effective C++.
Most of these were written in Fall, 2020.

<!--more-->

## 18. `unique_ptr`

1. Custom deleter may increase the size of each `unique_ptr` instance.
    - Captureless lambda as deleter is most ideal and incur no size penality.
    - Ordinary function as deleter increase instance size to 2 pointer.
2. Avoid `unique_ptr<T[]>` anyway.
    - Unless you can't. e.g. legacy API returning raw pointer to heap array's first element, and you have to assume ownership.
    - Use `vector`.
3. `shared_ptr`'s copy ctor
