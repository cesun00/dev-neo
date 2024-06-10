---
title: "Inline Static Function"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

In 95% of the scenarios, using `inline static` function with implementation in a header file is what you should do when you want to inline calls to a function; (there is no function anymore, just a code snippet copied and pasted)

The situation gets a little bit complicated if you want or have to separate the declaration and definition of a function,
or want to know how and why of this practice.

<!--more-->

TL;DR:
1. if you want `inline`, always use `static`, *regardless in header or c files*.

    if you want to inline the calls of a function, always use `static` with `inline`.

2. if you want `static`, `inline` causes the calls faster, but increases the size of code. Do the trade-off.


