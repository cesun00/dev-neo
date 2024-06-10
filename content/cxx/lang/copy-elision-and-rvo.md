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

void foo(X gg) { }

X bar() {
    std::string id{/* e.g. get id from RPC connection */};
    return X{id};
}

X zoo() {
    X named{"zoo - named"};
    return named;
}

int main() {
    X gg = zoo();
}
```

## `[, c++17)`

gcc stop eliding copy / move ctors when `-std=c++14 -fno-elide-constructors`.
[credit](https://stackoverflow.com/questions/50834215/is-there-a-way-to-disable-copy-elision-in-c-compiler)

## `[c++17, now)` guaranteed copy elision

c++20 11.10.5 allows compilers to generate code that omits the invocation to copy / move ctor of class,
despite potential side effect, resulting in zero-copy pass-by-value semantics.

Elision is mandatory by spec under the following circumstances:
1. A function local object of exactly the same type as declared function return type 


## Return Value Optimization (RVO)

## Named Return Value Optimization (NRVO)
