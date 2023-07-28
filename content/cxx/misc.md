---
title: "Miscellaneous C++ consideration"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Ownership

Ownership of resources is the responsibility to destroy those resources at proper time.

In any design, resource owning class should follow RAII, and follow the Single Resonsibility Principle:
it shouldn't have any public API other than
- the 6 reasonable special member functions
- a raw resourece accessor, as described in scott's `Item 15: Provide access to raw resources in resource-managing classes.`

## use `make_(unique|shared)` helpers instead of smart pointer constructor


https://stackoverflow.com/a/22571331/8311608


Overload a operator as a non-member function and declare it as friend to grant access to internal data members
https://stackoverflow.com/questions/2828280/friend-functions-and-operator-overloading-what-is-the-proper-way-to-overlo


## `reference_wrapper`

## dynamic dispatch: `vptr` and `vtable`

A polymorphism class is a class containing at least 1 virtual function.

To support dynamic dispatch for polymorphism class, compiler
- creates an array of function pointers called `vtable` (virtual table), **per class**;
- embeds 1 pointer called `vptr` (virtual pointer) **in each instance**, pointing to the `vtable` of its class

## use `make_(unique|shared)` helpers instead of smart pointer constructor

https://stackoverflow.com/a/22571331/8311608


Overload an operator as a non-member function and declare it as friend to grant access to internal data members
https://stackoverflow.com/questions/2828280/friend-functions-and-operator-overloading-what-is-the-proper-way-to-overlo


## be cautious instantiating class in a loop

```c++
struct Foo {
    Foo() { puts("constructed!"); }
    ~Foo() { puts("DE-structed!"); }
};

void bar() {
    Foo foo;
    // do something with foo
}

int main() {
    for (int i=0;i<10;i++) {
        bar();        
    }
}
```

If the compiler decided the instantiation can't be optimized out, the ctor and dtor will be called every single loop.
Do know if you really need a new instance every loop.

## c++ shift

https://en.cppreference.com/w/cpp/language/operator_arithmetic#Bitwise_shift_operators

unlike java which has the unsigned right shift `>>>` operator...

TODO: show mapping between shift operators and x86_64 instructions

## Most Vexing Parse

## `volatile` in C++ is useless

https://stackoverflow.com/questions/2484980/why-is-volatile-not-considered-useful-in-multithreaded-c-or-c-programming

TLDR: `volatile` variable only guarantees
1. read/write of that variable is actually from/to main memory (i.e. they penetrate the cache)
2. read/write of that variable happens in the source text order

ABSOLUTELY NO GUARANTEE ABOUT:
1. atomicity of read/write
2. forbidding instruction reordering. i.e. compiler still reorders instructions.
    "Assume that we use a volatile variable as a flag to indicate whether or not some data is ready to be read. In our code, we simply set the flag after preparing the data, so all looks fine. But what if the instructions are reordered so the flag is set first?"
3. cache flush or jvm piggyback whatever

Uninherited static data member in base class in the deadly diamond
```c++
#include <iostream>

struct A {
  static int c;
};

int A::c=42;

struct B : A {};
struct C : A{};
struct D : B,C {
  bool foo() {
                                     // nothing to do with inheritance here
    return (&B::A::c) == &(C::A::c); // this is just global namespace resolution...
  }

  static bool bar() {
    return (&B::A::c) == &(C::A::c);
  }
};


int main() {
  D d;
  std::cout<<std::boolalpha << D::bar() << d.foo();
}
```

