---
title: "C++ Initialization Types"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Initialization in C++ happens
1. as an optional part of a variable declaration that gives it an initial value.
2. when an expression as a function argument is bound to a function parameter
3. when an expression after function `return` is bound to the returned entity (received by caller or not)

The latter 2 can be equivalently viewed as a variable declaration with `initializer` in an obvious way.
We'll be focusing on the first scenario, which is the only hard part.

This article discusses various initialization syntax and their behavior in terms of C++ specification.
A comparison with C is given.

<!--more-->

## Background: Initialization in C

The AST of C defines a variable declaration as a comma-separated list of `init-declarator`, and each `init-declarator` expands to a `declarator` with an optional `= initializer`:

```
declaration:
    [extern|static] [const|restrict|volatile|_Atomic] <types> {init-declarator,init-declarator,...}

init-declarator:
    declarator
    declarator = initializer
```

```c
// declarator           = initializer
const char *const str   = "foobar";
int arr[42]             = {0};
```

The non-terminal `initializer` expands to either
1. an expression (i.e. can be evaluated for a value), or
2. a comma-separated list of `[designator-list =] initializer`, enclosed in braces.

```
initializer:
    assignment-expression
    { [designator-list] = initializer, [designator-list] = initializer, ... }
```

This second syntax is used to initialize either an array or a struct instance.
- The recursive appearance of `initializer` allows initializing nested structs.
- The optional `designator-list =` assigns explicit values to certain fields, instead of writing an initializer for each array item / struct field in the order.

This can lead to a rather complex nested initializer already:

```c
// declarator               = initializer
struct { int a[3], b; } w[] = {
    [0].a = {1},
    [1].a[0] = 2,
    [3] = {{1, 2, 3}, 5}
};

printf("%d\n", sizeof(w) / sizeof(w[0])); // 4
```

{{<card "info">}}

In C, objects are never "partially" initialized;
if there are fewer initializers than the size of the array or the number of structure elements, unmentioned elements / fields are initialized to zero.
For static storage no-op would suffice, and for stack allocation the compiler generates explicit `MOV [BP - n], 0` instructions.

{{</card>}}

#### The takeaways are:

1. The only part where `{}` is even relevant to initialization is when a nested initializer is needed.
2. The `=` between the `declarator` and `initializer` is mandatory.

## Initialization in C++: The Chaos

Declaration of variables can be simplified to a `decl-specifier-seq` followed by a comma-separated list of `declarator initializer` sequence, where the `initializer`, like in C, is optional:

```
simple-declaration:
    decl-specifier-seq {declarator initializer_opt, declarator initializer_opt, ...}

decl-specifier-seq:
    decl-specifier decl-specifier ...

decl-specifier:
    storage-class-specifier     # [static | thread_local | extern | mutable ]
    defining-type-specifier     # the types
    function-specifier          # for functions, don't care
    friend
    typedef
    constexpr
    consteval
    constinit
    inline
```

A `declarator` for variable declaration is simply the variable identifier;
the `initializer` is more interesting: if there is an equal mark (`=`), it's now part of the `initializer`,
compared to C where `=` is external to the `initializer`:

```
initializer_opt:
    <empty>                         # 0: initializer omitted
    initializer

initializer:
    brace-or-equal-initializer
    ( expression-list )             # 1

brace-or-equal-initializer:
    = initializer-clause
    braced-init-list                # 4

initializer-clause:
    assignment-expression           # 2
    braced-init-list                # 3

braced-init-list:           # roughly, curly brace surrounded stuff
    { initializer-list , }
    { designated-initializer-list , }
    { }
```

\* this AST is simplified and might be changed by future C++ versions. Check the latest specification for anything serious.

It's the lexical syntax of `initializer`, combined with the grammar analysis context, determines the initialization types in C++.

In the following discussion:
1. The type of the declared variable to which the `initializer` applies, is known as source type
2. **initializer expression** is the the [constituent expression](https://eel.is/c++draft/basic.exec#def:constituent_expression) (roughly means removing the outermost parentheses, curly brace, and equal mark, for each comma-separated element, if any) of the token sequence of`initializer`; the type of the initializer expression is known as destination type.

type of

### `initializer` Semantics

1. If the `initializer` is a (non-parenthesized) `braced-init-list` or is `= braced-init-list` (i.e. `#3` or `#4`); if the destination type is object (including array, class instance, primitives, etc) or reference, the variable is [list-initialized](#list-init); otherwise, program is ill-formed.

    ```c++
    int a{42};
    int b = {42};
    std::vector<int> c = {1,2,3}
    int &d{a};
    int foo[42] = {0};
    int bar[42]{0,0};
    ```

    For array type, the following  `Type array_name[n] = {a1, a2, ..., am};`,
    - if `n` is not given, the value of `m` is assumed.
    - if `m == n`, each item is initialized as is.
    - else if `m < n`, the first `m` items are initialized; the rest are value-initialized if possible, otherwise program is ill-formed.
    - else, `m > n`, i.e. too many items in initializer list, program is ill-formed

2. otherwise, if the destination type is reference type, the `initializer` must exist (i.e. can be any of `#1`, `#2`, `#3`, `#4`), and bind the reference to the initializer expression's evaluation result in the obvious way.

    ```c++
    int g(int) noexcept;
    void f() {
        int i;
        int& r = i;                   // r refers to i
        r = 1;                        // the value of i becomes 1
        int* p = &r;                  // p points to i
        int& rr = r;                  // rr refers to what r refers to, that is, to i
        int (&rg)(int) = g;           // rg refers to the function g
        rg(i);                        // calls function g
        int a[3];
        int (&ra)[3] = a;             // ra refers to the array a
        ra[1] = i;                    // modifies a[1]
    }
    ```

    Reference initialization is simple in semantics (i.e. simply bind a reference to an objcet, no constructor call, no `std::initializer_list` bothers), but complicated in terms of conversion and the rules regarding binding (const or not) lvalue / rvalue / forwarding reference to initializer expression of different value category. Readers are encounraged to refer to [the specification](https://eel.is/c++draft/dcl.init.ref) in details.

3. otherwise, if the destination type is one of `char[]`, `char8_t[]`, `char16_t[]`, `char32_t[]`, `wchar_t[]`, and the initializer expression is a string literal (i.e. can be any of `#1`, `#2`, `#3`, `#4`), the char array is initialized in the obvious way.

    `\0` will fill the unused space. If the declared array size is smaller to hold the string, program is ill-formed;

4. otherwise, if the `initializer` is `()` (the empty `expression-list` of `#1`), the object is [value-initialized](#value-init).

    ```c++
    int zero();
    // auto e = int(); // not this; this is copy-initialize with copy elision
    ```

5. otherwise, if the destination type is array, the `initializer` should be `( expression-list )` (i.e. `#1`), but can be `= { ... }` for backward-compatibility;
   each element in the array that has an initializer is [copy-initialized](#copy-init), and the rest is [value-initialized](value-init).

    ```c++
    // clang++ -std=c++20
    int inc() {
        static int c = 0;
        return ++c;
    }

    int foo[](1,2,3);
    int bar[10](inc(), inc(), inc()); // guaranteed evaluation order of 1,2,3; index [3-9] are value-initialized
    ```

    For `Type array_name[n](a1, a2, ..., am);` or 

6. otherwise, if the destination type is a class type, and is the same as source type:

{{<fold>}}

- if (i.e. #2 or #3)

    ```c++
    T x = T();
