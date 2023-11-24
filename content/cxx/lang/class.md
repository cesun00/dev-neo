---
title: "Overview: The Class Construct"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## constructor

Within a class member specification, the declaration of a non-static, non-template member function is a constructor declaration if

<!-- TODO -->

```c++
struct S {
  S();              // declares the constructor
};

S::S() { }          // defines the constructor
```

The constructor is considered a function with no name.

## Special Member Functions (SMF) {#smf}

(c++20 11.4.3.1) A class have

- at most 1 default constructor,
- at most 1 copy constructor,
