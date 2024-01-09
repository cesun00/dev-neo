---
title: "C++ Idioms Collections"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Some C++ Idioms collected. Use this article as a cheetsheet.

<!--more-->

## Erase-remove idiom

In contiguous storage, delete items that satisfy a given predicate.

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
#include <sstream>

void pvec(const std::vector<int> &v) {
	std::stringstream ss;
