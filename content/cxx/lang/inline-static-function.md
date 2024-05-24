---
title: "Inline Static Function"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

In 95% of the scenarios, using `inline static` function with implementation in a header file is what you should do when you want to inline calls to a function; (there is no function anymore, just a code snippet copied and pasted)

The situation gets a little bit complicated if you want or have to separate the declaration and definition of a function,
or want to know how and why of this practice.

<!--more-->

TL;DR:
1. if you want `inline`, always use `static`, *regardless in header or c files*.

    if you want to inline the calls of a function, always use `static` with `inline`.

2. if you want `static`, `inline` causes the calls faster, but increases the size of code. Do the trade-off.


## how 

Recall that specifiers only work on declaration of functions and variables.
If they appears in the definition of a function / variable without a previous declaration, it's consider to be a declaration as well.

For declaration:
- `inline`: call to this function shall be replaced with the function body. (To compiler) please read on and you'll find the definition in the same translation unit.
- `static`:
  - (To compiler) please read on and you'll find the definition in the same translation unit.
  - Plus, don't expose this symbol to other units.
  - can't coexist with `extern`
- `extern`:
  - (To compiler) the definition in not the same translation unit, but you'll find it in other object file at link time.
  - the default if neither `static` nor `extern` is present.
  - can't coexist with `static`


For definition: `inline` / `static` / `extern`: if there is no previous declaration, work as if this is also an declaration with `inline` / `static` / `extern`.

Declaration takes precedence if it has different specifier than definition.

This implies `static inline` and `extern inline` declarations are both legal.

Inside a fully pre-processed source file:
- `static inline`: call to my definition shall be inlined. You'll find the definition later in this unit, but don't expose this symbol definition to other units. You may choose not to generate a separate copy of this function's text at all.
- `(extern) inline`: call to my definition shall be inlined. You'll find the definition later in this unit. Please generate a separate copy of this function, since other units are going to use this. (It's impossible for call from other unit to be inlined.)


## C99 vs GNUC

Inline semantics differs in  C99 and GNUC.