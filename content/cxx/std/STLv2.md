---
title: "STLv2"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

## infrastructures

### Core concept `ranges::range`

`T` satisfies `range` if `ranges:begin(t)` and `ranges::end(t)` compiles, where `t` is lvalue expression of type `T`.

e.g. Both `vector<int>` and `vector<int>&` satisfies `range`.

### Core concept `ranges::view`

*Every `view` is `range`.*

`view` captures a **non-reference type** `T` that satisfies `range`,
plus its copy ctor (if exist), copy= (if exist), move ctor (must exist), move= (must exist) all work in `O(1)`.
e.g. `std::string_view` satisfies `view`, but `std::string_view &` does not.

```c++
template<class T>
concept view = ranges::range<T> && std::movable<T> && ranges::enable_view<T>;

template<class T>
