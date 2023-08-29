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

3 equivalent syntaxes to apply concept restriction on the template arguments:

```c++
// #1 "requires-clause after template-parameter-list"
template<typename BaseType, typename DerivedType> requires std::derived_from<DerivedType, BaseType>
void foo() { }

// #2 "trailing-require-clause", useful when member function itself is not templated, but has type constraint on class template argument.
template<typename BaseType, typename DerivedType>
void foo() requires std::derived_from<DerivedType, BaseType> { }

template<typename T>
struct Foo {
    void bar() requires std::integral<T> {/**/}
}

// ditto, but demonstrating trailing-return-type must precede trailing-require-clause
template<typename T> 
auto foo() -> void requires MyConcept<T> { }

// #3 "type-contraint in template-parameter-list"
// Note how this syntax omits the first argument of the concept's template-parameter-list, comparing with #1 and #2
template<std::derived_from<Base> DerivedType>
void foo() { }
```

When these syntaxes are mixed, constraints on each parameter are considered logically AND-ed.

## Vocabularies

- predicate "is statisfied by": a concept is satisfied by a sequence of template argument when it evaluates to true. This is almost a syntactic check.
- predicate "is modeled by": A sequence Args of template arguments is said to model a concept C if Args satisfies C ([temp.constr.decl]) **and meets all semantic requirements** (if any) given in the specification of C. `[res.on.requirements]`

https://stackoverflow.com/questions/62581829/satisfied-and-modeled-concept

## Concept is a better way of acheving SFINAE

```c++
#include <cstdio>
#include <type_traits>
