---
title: "C++ STL Container & Iterator"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

C++ specification leaves the implementation of STL iterators to be vendor-defined.

```c++
template<class T, class Allocator = allocator<T>>
class vector {
    using iterator = implementation-defined ;
    using const_iterator = implementation-defined ;
}
```

## vector over list

https://stackoverflow.com/questions/2209224/vector-vs-list-in-stl#comment20988862_2209233
https://www.stroustrup.com/bs_faq.html#list

Bjarne Strostrup actually made a test where he generated random numbers and then added them to a list and a vector respectively. The insertions were made so that the list/vector was ordered at all times. Even though this is typically "list domain" the vector outperformed the list by a LARGE margin. Reason being that memory acces is slow and caching works better for sequential data. It's all available in his keynote from "GoingNative 2012"

## push_back and emplace_back
