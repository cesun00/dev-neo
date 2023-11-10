---
title: "C++ Initialization Types"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Initialization in C++ happens
1. as an optional part of a variable declaration that gives it an initial value.
2. when an expression as a function argument is bound to a function parameter
3. when an expression after function `return` is bound to the returned entity (received by caller or not)

The latter 2 can be equivalently viewed as a variable declaration with `initializer` in an obvious way.
We'll be focusing on the first scenario, which is the only hard part.

This article discusses various initialization syntax and their behavior in terms of C++ specification.
A comparison with C is given.

<!--more-->

## Background: Initialization in C

