---
title: "Value Category and Move Semantics"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Value category is a property of an expression.
Prior to C++11, the specification only identifies 2 value categories:

- lvalue: roughly means expressions that can appear on the left-hand side of assignment operator `=`
- rvalue: roughly means expressions that cannot

    As a special case, all function calls in C are rvalue, thus `puts("foo") = 42` is illegal.
    But the introduction of reference in C++ breaks the game, `foo() = 42` is valid if `foo` returns a non-const reference.

Since C++11, each expression falls into exactly 1 of the following 3 value categories:

- prvalue expression
    - can be evaluate for a value at run time,
    - but no guaranteed memory storage for that result.
- lvalue expression
    - can be evaluate for a value at run time,
    - plus, identify an existing object with precise memory address
- xvalue expression
    - can be evaluate for a value at run time,
    - plus, if used in a fashion that require memory storage, allocation is guaranteed.

Under the new glossary,
- glvalue = lvalue + xvalue
- rvalue = prvalue + xvalue
