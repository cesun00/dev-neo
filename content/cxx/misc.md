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



## ways to Lazy Init

Lazy initialization refer to the fact that:

If our only intention is to lazy initialize a data member or local variable, since C++ 17 we can use the std::optional. This free us from the usage of heap memory (to be more precise, the usage of a pointer to separate heap memory, since the host class itself might be already in the heap, in which case you can't avoid the heap anyway), and express our intention of lazy init explicitly.

A deeper implication is that, it also enable a variable to escape its scope:

### pointer or `unique_ptr`

pro: little space on stack
con: pay for heap allocation and pointer indirection per access.

### non-initializer object (stack only)

### `std::optional`

`std::optional` can be used to pre-occupy stack space without initialize it.


This is equivalent to

```
struct foo {
    char value[100];
};

void foo() {
    foo a; // TODO: no init
    std::optional<foo> b;
}
```

## Abstract class are considered complete type:

https://stackoverflow.com/questions/16597389/are-c-abstract-classes-incomplete-types

## Integer Promotion

Each integer type, signed or unsigned, is assigned a *rank*, described as follows:

1. Rank increases with the growth of integer precision (i.e. width).
2. rank of `signed x` equals rank `unsigned x` - its unsigned counterpart

```
         ^       (signed)            (unsigned)
         |       long long       =   unsigned long long
rank     |       long            =   unsigned long
increase |       int             =   ...
         |       short               ...
         |       char
```

**integer promotion** is the implicit conversion from any integer type (signed or unsigned) whose rank is less than `int`,
1. to `int` if that's large enough to hold the original numeric value.

    e.g. For `unsigned char a = 42, b = 55;`,  `int c = a + b` first promotes both `a` and `b` to `signed int`, even there were `unsigned char`.

 2. otherwise, to `unsigned int`.


## Lambda


TODO: size of lambda object? pass by value or reference? code storage?

Lambda's design follows a one-type-per-instance policy. No lambda objects share the same type even if their bodies are identical.

The only way to refer to the type of an labmda is through `decltype()` of the lambda object.

### generic lambda

Generic lambda is a syntax sugar for function template.
Unlike normal labmda which gets into `.text` immediately, it gets instantiated (generates code) only upon invocation.

## Argument-Dependent (Koeing) Lookup 

Namespaces form lexical scopes of names, same as functions and whatever constructs involving a pair of brace `{}`.

If the declaration of a name can't be found in the current scope, compiler repetitively perform lookup in scope one level up.
If compiler finished examining the default global namespace and still no declaration of such name is found, program is ill-formed (with some compiler-specific exceptions that will assume the declaration and hope linker find the symbol later; ignore this mess for now).

This is the common name lookup we are all familiar with.

```c++
namespace foo {
    void bar();
}

int main() {
    bar();      // compiler complains `bar` can't be found - as expected
}
```

```c++
namespace foo {
    struct bar { };

    void baz(int c) { std::puts("foo::baz(int)"); }

    void zoo(bar obj) { std::puts("foo::zoo(foo::bar)"); }
}

int main() {
    //main.cpp:17:5: error: ‘baz’ was not declared in this scope; did you mean ‘foo::baz’?
    //   17 |     baz(42);
    //      |     ^~~
    //      |     foo::baz
    baz(42);

    // works just fine - WTF?
    zoo(foo::bar{});
}
```



Conversion Transitivity Graph
============

There is a conversion from type X to type Y if any of the following holds:
1. fpop
2. fpop
3. fpop
