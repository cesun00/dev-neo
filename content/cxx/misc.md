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

## VALUE

7.1.1   An expression is a sequence of operators and operands that specifies a computation. An expression can result in a value and can cause side effects.

Value is one of the 13 entities.

A value is the result of evaluating an expression.

It doesn't make sense to take the address of 3+5,

// and there is absolute no reason for compiler to arrange storage for such a result. At runtime the wildest thing compiler can write for you is just call the ADD instruction and put the result in the EAX register of x86_64.
```c++
int *p = &(3+5) // WTF
```


Interchangability of Reference and Object / Reference Collapsing
=======================

> If an expression initially has the type “reference to T” (9.3.3.2, 9.4.3), the type is adjusted to T prior to any further analysis.
> <cite>c++20 7.2.2.1</cite>

That's why when you request an object but get a reference, everything works fine.

```c++
void foo(int c){}

int main() {
    int a = 42;
    int &b = a; // variable b has type "reference to int"
    foo(b); // expression `b` has type `int`
}
```

## const member function

```c++
#include <cstdio>

struct X{
    void foo() const {
        puts("foo const");
    }

    void foo() {

        puts("foo non-const");
    }
};


int main() {
    X x;
    const X cx;
    x.foo();
    cx.foo();
}
```

TODO:: REALLY? A NON CONST object should be able to call a CONST member function.

`void foo() const` can only be called on a const qualified `foo` instance. `const` effectively take part in the overload resolution.

Inside the `const` qualified member function, `*this` is const qualified, which means among other member functions, only `const` qualified member functions can be called;

Really, "const member function promised not to change its object", is a consequence, not its motivation.


https://en.cppreference.com/w/cpp/language/overload_resolution

> If any candidate function is a member function (static or non-static), but not a constructor, it is treated as if it has an extra parameter (implicit object parameter) which represents the object for which they are called and appears before the first of the actual parameters.

Similarly, the object on which a member function is being called is prepended to the argument list as the implied object argument.

For member functions of class X, the type of the implicit object parameter is affected by cv-qualifications and ref-qualifications of the member function as described in member functions.


TODO: see ref-qualified member funciton, and relate to the implied object parameter/argument as well.



## polymorphismn

*polymorphism* refers to the fact that a single "interface" works for different argument types.

Depending on your interpretation of what "interface" is / includes, polymorphism can further be divide into:

1. ad-hoc polymorphism.

    You write multiple pieces of source code but keep the same interface, in order to make that interface works for multiple types.

    Almost always this means function overload. Here "interface" is cunningly interpreted to contains only the function name used for invocation, without parameter types and count, etc.

2. parameteric polymorphism (a.k.a static / compile-time polymorphism)

    You write a single piece of source code, thus having a single interface, and make it works for multiple argument types by 

3. subtyping (a.k.a runtime polymorphism)

    You write a single piece of source code, thus having a single interface, and make it works for multiple argument types by



Function name as pointer type
=================

## C

C99 states that
> (6.7.5.3.8) A declaration of a parameter as ‘‘function returning type’’ shall be adjusted to ‘‘pointer to
> function returning type’’, as in 6.3.2.1.

This means the following both compile and are equivalent:

```c
void foo1(void f(void)) {}
void foo2(void (*f)(void)) {}
```

Function parameter declaration is the only place where function type name can be spell without an parentheses-enclosed asterisk.
e.g. the following variable declarations are illegal:

```c
void foo(void){}

// WRONG
void f1(void) = foo;
void (f2)(void) = foo;
```

Also:
> (6.3.2.1.4) Except when it is the
> operand of the sizeof operator or the unary & operator, a function designator with
> type ‘‘function returning type’’ is converted to an expression that has type ‘‘pointer to
> function returning type’’.

This means the following both compile and are equivalent:

```c
void foo(void) {}

int main() {
    void (*f1)(void) = foo;
    void (*f2)(void) = &foo;
}
```

Combined, this is a well-formed c99 program:

```c
#include <stdio.h>

static void foo() {puts("foo");}

static void bar1(void f(void)) { f(); }
static void bar2(void (*f)(void)) { f(); }

int main() {
    bar1(foo);
    bar1(&foo);
    bar2(foo);
    bar2(&foo);
    return 0;
}
```

## C++


compile-time dependency
===========

A translation unit accesses functionalities (functions, classes, type definitions, etc) from other translation units by including headers containing declaration of those functionalities. The most common scenario is a client program including headers from third-party libraries.

A client's translation unit is said to have compile-time dependency on a library header if modification in the library header (due to the library being updated) potentially induces a recompilation of the translation unit. Otherwise, it suffices to update the whole program by simply relinking.

Compile-time dependency happens when library headers expose non-(runtime-)polymorphic types (i.e. "concrete" types rather than references and pointers) used by clients.

Library designed `Foo` to hold some data and expose an iterator, with the hope that clients use `Foo` as a collection of items without caring about the *implementation details*, specifically, type of the underlying data container (thus type of iterator), in this case `vector`.

```c++
// library header
class Foo {
public:
    using iterator = std::vector<int>::iterator;
    iterator begin() const;
    iterator end() const;
private:
    std::vector<int> data;
};
```

Client now can write code without mentioning `vector` at all. But compiler need to know that `iterator` resolve to `std::vector<int>::iterator` when the client translation unit get compiled. If later the library author decides to change `std::vector` to `std::list` (thus `iterator`), client's old object file won't link with the new library object file, because the library object file doesn't expose the old symbol name anymore after mangling due to the change of type.

*By introducing compile-time dependency, library author relinquishes the freedom of transparently changing part of library that were meant to be implementation details, and bother the client of at least a recompilation.*

## "type erasure", not quite the Java sense

C++ community coined the word "type erasure" to mean rewriting statically polymorphic code into runtime polymorphic code.

e.g. A function template can take whatever type arguments as long as the instantiation is successful. To type-erase the function template is to put commonality of those types into an base class, and write an ordinary function taking parameter of the base class pointer / reference.

Such rewrite [is not trivial](https://stackoverflow.com/questions/13670671/abstract-iterator-for-underlying-collections). For this reason, unlike java, you will almost never see someone use "abstract" base iterator in C++.


Pros:
1. eliminate compile-time dependency

Cons:
1. introduce virtual pointer
