---
title: "Class Template"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- C++
- Programming Language
- template
---

## Class Template Argument Deduction (CTAD) (c++17) {#ctad}

TODO: CTAD happends through FTAD on class's ctor?

## misc

### Mind static data member in class template

All instantiations of a class template with the same template arguments share the same memory of data member:

```c++
#include <cstdio>

template<int N>
struct Foo {
    static int data[N];
};

template<int N> int <MAXN>::data[N];

int main() {
    printf("%p\n", Foo<120>::data);     // 0x5d50b4264040
    printf("%p\n", Foo<120>::data);     // 0x5d50b4264040
    printf("%p\n", Foo<240>::data);     // 0x5d50b4264220
    printf("%p\n", Foo<240>::data);     // 0x5d50b4264220
}
```
