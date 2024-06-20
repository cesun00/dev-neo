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
