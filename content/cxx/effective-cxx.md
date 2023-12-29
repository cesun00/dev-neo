---
title: "Memo: Effective C++ (Scott Meyers, 2006)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

This is a memorandum on my walk through the Effective C++.
Most of these were written in Fall, 2020.
Sections that don't hold anymore for new C++11 and later are removed.

<!--more-->

## 7. make dtor virtual in ALL base classes

We only consider public inheritance here. Private and protected inheritance have their composition alternative.

## TLDR

Clang raises a warning if a class has virtual functions and non-virtual dtor (`-Wnon-virtual-dtor`).

For the library coder:
- if a class is designed to be a base class, make its dtor virtual anyway (regardless it having virtual functions or not)
- Otherwise, don't, for the sake of performance. Abusing `virtual` is as stupid as forgetting it.

For the client coder:
- Never inherit from a class whose dtor is not `virtual`.

## the longer

You are the library coder:

```txt
if (a class is designed to be a base class) {
    if (except the dtor, any member function is virtual) {
        make dtor virtual too
    } else {
        You are looking at a base class whose behavior is not meant to be overriden. TODO: I don't see good example of this for now.

        Making dtor of such base class
        1. virtual:      burden the performance when base class object is used on its own. Each instance now carries a useless vptr.
        2. non-virtual:  exposes client to the the danger of pointing to an derived class instance via base class pointer. Good API design makes it hard / impossible to use it wrong, but now you have to doc it and hope your user read the doc.

        Thta's a tradeoff. But I really think (2) is intolerable, while (1) is pre-mature optimization.

        Make dtor virtual as well.
    }
} else {
    A leaf class. Warn everyone in the doc, absolutely not to inhert from it.

    Make dtor non-virtual, for the sake of performance.
}
```

```c++
Base *p = new Derived;

// ~Derived() always calls ~Base() in its end no matter what.
// 
// Having virtual ~Base() ensures such chained destruction starts from appropriate bottom, not somewhere in the middle.
delete p;
```

# 15. Provide access to raw resources in resource-managing classes.



# 20. Prefer pass-by-reference-to-const to pass-by-value.

Scott mentioned the so-called *slicing problem*, which is essentially a misunderstanding about polymorphism in C++ which only happens via pointer or reference.

```c++
class Base {
public:
    Base(const Base &other) {

    }
};

class Derived : public Base {
public:
    Derived(const Derived &other): Base{other} {
        
    }
};

void foo(Base base) {

}

// A Base instance is required but a Derived instance is provided.
// Compiler tries to find a conversion path from Derived to Base, and the one found is Base's copy ctor:
// overloads resolution succeeds due to C++'s reference/pointer-based polymorphism,
// i.e. an base class reference can bind to a derived class instance
//
// Eventually only Base's copy ctor is executed, leaving Derived's copy semantics totally ignored.
Derived d{};
foo(d);
```

> In general, the only types for which you can reasonably assume that pass-by-value is inexpensive are built-in types and STL iterator and function object types.

## MYTH

1. Don't inherit from classes from library, unless the library author explicitly recommended.
    - No matter what, public API should be `public`. Whatever library exposes to client via protected interface is a design smell.
2. Now you have design jurisdiction on whatever classes we are going to talk about. Suppose Both `class Foo1` and `class Foo2` needs functionality from `class Bar`.
    1. Use public inheritance if and only if liskov substitution from `Bar` referrence to `Foo?` is exactly what you want. Otherwise, NEVER.
    2. 

Public data member is evil. Protected data member is evil. USE ONLY private data member, and expose `public` / `protected` member function to support operations on them.
Try you best to avoid getters and setters to internal data structures (e.g. vector / set / etc.), because that would make no difference than exposing data member directly.
Instead, expose only semantic / business-related operations on those data members.

# 32: Make sure public inheritance models `is-a` relationship (a.k.a liskov works iff public inheritance)

```c++
class Derived: [public | protected | private] Base {
    // ...
}
```

- Public inheritance enables liskov substitution (so called `models "is-a" relationship`, this phrase never makes much sense to me)
- Priavte / protected inheritance is an exotic form of composition as a `private` / `protected` data member

`Base` has `protected` members because, apart from hiding them from public interface, it expects someone inherits from it and
1. override them (e.g. the template method pattern)
2. use them (i.e. provided utility functions / modifiable data members for derived classes)     ()

Private / protected inheritance breaks `Base`'s encapsulation: `protected` members of `Base` is accessible, which is impossible if composition is used. Breaking encapsulation is generally considered bad practice, but in this inheritance-or-composition case you can argue . Know the rules so 
    - Private inheritance has the effect that derived class of `Derived` can't see `Base` anymore. If this not intended, see `protected` inheritance.
    - protected inheritance is not cult, gcc stdlibc++ uses it.
- protected inheritance is an exotic form of composition (as a `protected` data member)
    -  solve the aforementioned problem, since `public/protected` members of `protected Base` becomes `protected`, and is visible along the downward hierarchy.

- Good design prevent invalid code from compiling (as early as possible), rather than raise runtime error.
- Good API design make it hard / impossible to use it wrong.
- `OperationNotSupportedException` is a joke confirmed. Shame on you oracle JDK designer.
