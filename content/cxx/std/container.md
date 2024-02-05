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

The signature of the only `push_back` in ancient c++98
```c++
void push_back (const value_type& val);
```

The parameter has to be a const reference, cuz that time only const reference can bind to a int literal (formally, the result of a rvalue expression)
```
vector<int> x;
int a = 0;
x.push_back(a); // #1
x.push_back(42); // #2 would be weird if we can't do this
```

This effectively create a 4 byte storage one the calling stack frame storing this 42, and bind a reference on `push_back`'s call stack to that storage.

Now, to officially put this 42 to the end of the storage of the vector, libstdc++ needs to copy that temporary 4 bytes again. libstdc++ developers cannot make assumption about how this reference is obtained, i.e. inside `push_back`, they can't tell #1 from #2.  Now replace int with any type this argument is still true.

With the introduction of rvalue reference in C++11, things changed. We now have a way in language level to tell such differences. Rvalue reference (even without const) can bind to literal (formally ... ).  It's an error to bind a rvalue reference to the result of a lvalue expression. The value category of the argument expression now join the overload resolution, and only the overload with a rvalue reference parameter will be matched and called. The libstdc++ developers now have a way to tell if the reference get passed in is binding to that temporary 4 byte storage on the calling stack, or is it a formal object living somewhere. This gives us the second signature added in C++11:

```c++
void push_back( T&& value );
```


The newly created temporary 42 is directly moved into the vector storage. No redundant copy.