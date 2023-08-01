---
title: "Copy / Move Elision and Return Value Optimization (RVO)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Copy / Move Elision

During a function call, copies may occur multiple times for arguemnts and function return:

```c++
class X {
public:
    X(): id{"unknown"} {std::puts("default ctor");}
    X(const std::string id): id{id} {std::puts("ctor with given id");}
    X(const X &other): id{other.id} {std::puts("copy ctor");}
    X(X &&other): id{std::move(other.id)} {std::puts("move ctor");}
    ~X(){std::puts("dtor");}
private:
    std::string id;
};
