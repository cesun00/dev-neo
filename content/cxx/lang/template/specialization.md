---
title: "Template Specialization"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

*Specialization* allows a *complete different* template definition to be used when specific 1) template arguments, or 2) patterns of template arguments is provided.

1) is the case for both full and partial specialization
2) is more expressive, and is only the case for partial specialization.

Specialization embodies ad-hoc polymorphism of metaprogramming: the same template name (interface) works for different type by really having multiple templates definition. It resembles function overloads, and is the the metaprogramming counterpart of the latter in many ways.

## Full specialization

Full specialization allows a complete different template definition to be used when specific template arguments is provided.

All template types (function template / class template / variable template / etc.) can have full specialization.

Its syntax is landmarked by keyword `template` followed by an empty pair of `<>`, with exact template arguments upon which this specialization should be selected for, spelled after the unqualifed name of the primary template, in another pair of `<>`:

```c++
// function template - primary template
template <typename T, std::size_t N>
void foo() {
    std::printf("primary template - %s\n", __PRETTY_FUNCTION__);
}

