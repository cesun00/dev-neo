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
    int foo;
    foo();  // compilation error. free function foo() totally shadowed.
}
```

Specifically, for AST node that turns out to be a function call expression, name lookup works as follows:
Starting from the containing scope of the call site:
1. if no declaration is found, search scope bubble up
2. else if a single decalration is found in the current scope, search stops at this scope
    - if it's a function declaration, it's the only member of *candidate set*.
    - Otherwise, it's either a functor object whose `operator()` will never join the candidate set, or program is ill-formed since name is not callable.
3. else if multiple declarations are found in the current scope, search stops at this scope
    - If all of them are function declarations, they are added to the *candidate set*.
    - Otherwise, they are either redeclaring the same non-function entity, or making program ill-formed by declaring different entities with same name.
4. If no declaration of any kind is found and search reaches the end of root namespace scope of current translation unit, ADL applies, whose results are add to the *candidate set*.

### 2. overloads resolution

Name lookup produces a set of function declaration of the desired name, i.e. the candidate set.
Overloads resolution determines, among the set, which declaration the call site is referring to.

### the Problems

Problems happens when C++ wants to allow functions and instantiation of function templates to be overloads of each others;
i.e. function declaration and function template declaration can share the same `declarator-id`.

## SFINAE

SFINAE refers to the technique of having multiple primary function templates (\*) `FT_1, FT_2, ..., FT_N` of the same name, and makes each of them `FT_X` only works for a limited category of template argument by intentionally triggering substitution failure in others `FT_Ys`, so that those whose substitution failed are discarded from overload resolution without raising an error.

Roughly speaking SFINAE is the function template's equivalence of function overloads.
Among all function templates declaration of a given name, compiler needs to select which one the call site is referring to.
It does so by inspecting all candidates function templates and perform *substitution*.
Those yielding valid function declarations are further inspected, and those yielding invalid ones are discarded *without raise an error*.
