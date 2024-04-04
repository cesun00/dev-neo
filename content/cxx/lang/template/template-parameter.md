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
void foo(Ts... fpp) {}

foo(42, 32.01); // instantiated as foo(int, double)
```

Here,
- `Ts` denotes an ordered list of template arguments (in this case, types `int` and `double`)
- `fpp` denotes an ordered list of function arguments (in this case, `42` and `32.01`)

In order to use these collective names, *pack expansion* is introduced: a pattern (\*) containing a template / function parameter pack can be followed by an ellipsis, to generate a comma-separated list of the result of such pattern being applied to each items.

\* The word *expression* is used by spec to refer to run-time evaluated expression only.
The word *pattern* is choosed to includes compile-time construct as well.

```c++
/**
 * Pack expansion on function parameter pack
 */
template<typename... Ts>    // this ellipsis introduces template parameter pack
void foo(Ts... fpp) {       // this ellipsis introduces function parameter pack
    std::printf("%d, %f\n", (fpp + 3)...);    // this ellipsis performs pack expansion
}

foo(42, 32.01); // instantiated as foo(int, double), prints 45, 35.010000


/**
 * Pack expansion on template parameter pack
 */
template<typename...>
struct Tuple {};
 
template<typename T1, typename T2>
struct Pair {};
 
template<class... Args1>
struct zip
{
    template<class... Args2>
    struct with
    {
        using type = Tuple<Pair<Args1, Args2>...>;
        // Pair<Args1, Args2>... is the pack expansion
        // Pair<Args1, Args2> is the pattern
    };
};

using T1 = zip<short, int>::with<unsigned short, unsigned>::type;
```

A function template can have multiple parameter packs; while A class template can have at most 1.

## variadic function template

A function template can have multiple parameter packs, and can be arbitrarily ordered, [as long as template argument deduction succeeds](https://stackoverflow.com/questions/9831501/how-can-i-have-multiple-parameter-packs-in-a-variadic-template)

An important purpose of function template pack is to enable *function parameter pack*: named sink function parameter of variadic function, with each argument typed by its respective (potentially deduced) type template parameter.

```c++
```

### variadic class template

A class template can have at most 1 parameter pack, which must appear as the last template parameter.

```c++
template<typename... Types>
struct Tuple {};
 
Tuple<> t0;           // Types contains no arguments
Tuple<int> t1;        // Types contains one argument: int
Tuple<int, float> t2; // Types contains two arguments: int and float
Tuple<0> t3;          // error: 0 is not a type
```

### Function Template Argument Deduction (FTAD)

Deducing function template arguments is available since the beginning of C++,
while [deduction for class template](#ctad) is only available since c++17.



## Misc

### default template argument

Regardless of being a `type / non-type / template` template paramter, it can have a default value as argument:

```c++
template<int N = 42> void foo() {}
