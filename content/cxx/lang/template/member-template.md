---
title: "Member templates"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

A member template is a function / class / variable / alias template that appears inside the `member-specification` of the class (i.e. class body).

- All instantiations of member templates have equal member access as their non-template counterparts.
- The `static` semantics applies normally.

Member templates are different creatures than other members, in that their code is compiled at client side (or for metaprogramming code, evaluated at client's compiler).

Class members are fixed once library author released the binaries and headers. Instantiation of member templates doesn't "get into" the class definition. i.e. a member template is itself class member. *It's not member function / member class / data member generator.*