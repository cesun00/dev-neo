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

    It's led by the name of a [structural type](https://en.cppreference.com/w/cpp/language/template_parameters#Non-type_template_parameter) (roughly, integrals, pointers, enums - specifically, not `std::string` ), or `auto`

    ```c++
    template<int N>
    void make_array() {}

    template<auto N>
    void make_array() {}
    ```

3. template template parameter (a template parameter that takes another class / function template as argument), led by the keyword `template`

    ```c++
    template<template TMPL>
    void make_array() {}
    ```

## Template Parameter Pack (since C++11)

A template can have a variable-length parameter list, introduced by an ellipsis (`...`):

```c++
// non-type pack
template<int... pack_name>

// type pack
template<typename... pack_name>

// type pack, constrained
template<concept_name... pack_name>

// template pack
template<template<parameter_list> typename... pack_name>
```

The all-taking sink parameter is called a *parameter pack*. Such a template is called a *variadic (class / function) template*.
A single pack can take an arbitrary number of arguments of one of the 3 types of template parameters.

### Function Template Parameter Pack & (Pattern-Based) Pack Expansion

{{<card "warn">}}

Feature for function template only.

{{</card>}}

Once instantiated, a parameter pack denotes an ordered list of template arguments, which only exists at compilation time.
This is enough for the compiler's type reasoning system to work.

In order for this feature to have further run-time impact, C++ allows the function parameters of variadic function template to be
1. also variadic; and
2. each typed by the (usually deduced) types in the template parameter pack, respectively.

```c++
template<typename... Ts>
