---
title: "Overview: The Class Construct"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## constructor

Within a class member specification, the declaration of a non-static, non-template member function is a constructor declaration if

<!-- TODO -->

```c++
struct S {
  S();              // declares the constructor
};

S::S() { }          // defines the constructor
```

The constructor is considered a function with no name.

## Special Member Functions (SMF) {#smf}

(c++20 11.4.3.1) A class have

- at most 1 default constructor,
- at most 1 copy constructor,
- at most 1 move constructor,
- at most 1 copy assignment operator,
- at most 1 move assignment operator, and
- prospective destructors

all of which are known as *special member functions* of that class.

## glossary

**user-declared**: A SMF is said to be user-declared if the user types an constructor declaration in the program source.

#### default ctor

A default ctor is a ctor whose every parameter has a default argument, including one with an empty parameter list.

If there is not any user-declared ctor (i.e. no declaration of ad-hoc ctor, no copy, no move ctor), the compiler treats it as if there is a declaration:

```c++
class {
public:
    /*non-explicit*/ ClassName() = default;
}
```

This declaration can't have corresponding implementation in the user's source.

#### copy ctor / move ctor

For `class X`, its copy / move ctor is a non-template ctor
- whose first parameter is of type (possibly cv-qualified) lvalue-reference / rvalue-reference `X` , i.e `(cv) X&` / `(cv) X&&`, and
- all other parameters, if any, has a default argument.

#### copy / move assignment operator

For `class X`, its copy / move assignment operator `X::operator=` is a non-template non-static member function
