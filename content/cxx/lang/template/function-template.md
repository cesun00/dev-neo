---
title: "Function Template"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

Canonically, a function template ...

{{<columns>}}

### ... is declared by 

```c++
template<typename T>
void foo(T);
```

C++20 allows a function declaration to have placeholder type (i.e. `auto`) or constrained placeholder type (i.e. constrained `auto`)
as an equivalent syntax of function template declaration with type parameter:

```c++
// equivalent to above
void foo(auto);
```

<--->

### ... is defined by 

```c++
template<typename T>
void foo(T) {/**/}
```

In most cases, the definition part of a function template is trivial, and doesn't affect the
templating resolution or metaprogramming magic at all.

{{</columns>}}

## Instantiation

A function template has to be instantiated, either implicitly or explicitly, in order to get into the executable code and thus be useful.

### Implicit Instantiation

### Explicit Instantiation

## Template Argument Deduction (TAD)
