---
title: "Introduction to C++20 Concept"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Concept
- Programming Language
---

Prior to C++20, type parameters in a template definition are introduced with `template<typename T> ...`, where `T` can bind to any existing type as long as the resulting code compiles. There is no way for a client programmer, upon seeing the template definition in a header file, to know what types can be used as arguments to the template other than reading the document.
 
*Concepts* is a C++20 feature that restricts, at the language level, the set of types that can be used as a type argument to a template.
It allows the template author to better communicate the template interface to the clients.
Some authors also call concepts the static interfaces of C++.

Static checks are enforced by the compiler at compile time. During an instantiation, templates that fail to satisfy the required concept will cause it to be discarded in the template overload resolution; this behavior makes concepts a better syntax to implement SFINAE.

<!-- When the instantiation  -->
<!-- It's known as a *substitution failure* if the type argument `T` causes syntax error in the resulting instantiation. -->
<!-- property a type must exhibit in order to be acceptable  --
<!---->

## Syntax

The definition of a concept must appear at the namespace level:

```c++
template < template-parameter-list >
concept concept-name = constraint-expression;
```

The `constexpr` `ConceptName<...>` produces a `bool` directly. Unlike type traits, no `::value` is needed. It can be used in
- `type-constraint`, i.e. 1 of the following 3 syntaxes
- `id-expression`, e.g. (TODO)
- `static_assert`

