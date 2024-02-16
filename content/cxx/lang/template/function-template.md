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

In order to instantiate a function template, every template argument must be known, but not every template argument has to be specified.
The compiler infers a template argument, if not explicitly specified, by **only looking at the declaration** of a function template.

```c++
// g++ -c
template<typename T>
void foo(T& ref);

int main() {
    int a = 42;
    foo(a);
}
```

{{<card "info">}}

The absence of the implementation body is not itself a deduction failure, but will cause a link-time error of an undefined symbol, unless 
the implementation is found later in the same compilation unit source; or (in case of explicit instantiation) a symbol for its compiled machine code is found in the link stage.

{{</card>}}

Just to ensure the statement is clear: compiler infers the value of template argument, which is not necessarily the type of function argument.

It is the value of template argument inferred, not the type of function argument.


1. the type argument
2. the 

template argument deduction (which is only applicable for function template) does not requires definition.
Declaration of the function template is enough for TAD to work:
