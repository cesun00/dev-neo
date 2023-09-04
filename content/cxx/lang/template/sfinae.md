---
title: "SFINAE, aghhhh"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## plain function overloads in a world without template

In a world without template, When a function call expression (as described in`[expr.call]`) is encountered,
compiler performs 2 steps to eventually determine which function to call.

<!--more-->

### 1. name lookup

Qualified name lookup e.g. `::std::cout` is simple as it always start from the root namespace.
We discuss unqualified name lookup only.

Name lookup is the general procedure of associating a use of name (i.e. is itself not a declaration) with its declaration.
It's a low level concept that applies to all names, regardless of how the name is used (e.g. regardless of it being in a function calls / lhs of an assigment / etc.)

It's goverened by the scope rule:
Starting from the use site, the innermost declaration of that name is immediately used,
leaves the outer declarations with the same `declarator-id` shadowed (completely ignored).

```c++
void foo();

int main() {
