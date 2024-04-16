---
title: "Template Parameters"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

This article documents C++ features related to parameterized templates, common for all of function / class / whatever templates.

## Template Parameters

A template declares its parameters list in a pair of angle brackets. There are 3 types of template parameters:
1. type template parameter receives a type identifier as argument

    It's led by a `typename` or a `class` keyword:

    ```c++
    template<typename T>
    class Container<T> {}
    ```

    type template parameter can be constrained, in which case it's led by concept name:

    ```c++
    template<std::range T>
    class Container<T> {}
    ```

2. non-type template parameter receives a value as an argument
