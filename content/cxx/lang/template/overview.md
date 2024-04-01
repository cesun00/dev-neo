---
title: "Overview of C++ Template"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

Essentially, the template system in C++ is an advanced macro processor.
Arbitrary textual program sources can be generated via the instantiation of a template.
Depending on the role of the generated construct, there are

<!--more-->

| category            | by instantiating which you obtain a     |
|---------------------|-----------------------------------------|
| function template   | function definition                     |
| class template      | class definition                        |
| variable template   | variable declaration.                   |
| type alias template | `using identifier = type;` declaration. |

It's very important to distinguish between different category of template, as some C++ features are only applicable to a certain category.
e.g. historically, template argument deduction (TAD) is for function templates only, while class template argument deduction (CTAD) is newly added in C++17 and should be separately discussed.

All of them can appear in the member specification of a class, becoming so-called *member templates*.
