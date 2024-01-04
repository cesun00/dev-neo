---
title: "Value Category and Move Semantics"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Value category is a property of an expression.
Prior to C++11, the specification only identifies 2 value categories:

- lvalue: roughly means expressions that can appear on the left-hand side of assignment operator `=`
- rvalue: roughly means expressions that cannot

    As a special case, all function calls in C are rvalue, thus `puts("foo") = 42` is illegal.
    But the introduction of reference in C++ breaks the game, `foo() = 42` is valid if `foo` returns a non-const reference.

Since C++11, each expression falls into exactly 1 of the following 3 value categories:

- prvalue expression
    - can be evaluate for a value at run time,
    - but no guaranteed memory storage for that result.
- lvalue expression
    - can be evaluate for a value at run time,
    - plus, identify an existing object with precise memory address
- xvalue expression
    - can be evaluate for a value at run time,
    - plus, if used in a fashion that require memory storage, allocation is guaranteed.

Under the new glossary,
- glvalue = lvalue + xvalue
- rvalue = prvalue + xvalue

![](cxx_vcat_venn.png)

## determine value category of an expression

It's usually not hard to determine the value category of an expression from intuition.
The only notable one is function call, its value category depends on its return type:

Call to a function that returns...

{{<columns>}}

... non-reference type become a prvalue expression

```c++
struct X { int a; };

X foo() {
    return X{42};
}

int main() {
    X c = foo();
}
```

<--->

...4 lvalue-reference become a lvalue expression:

```c++
int& foo() {
    int *c = new int{42};
    return *c;
}

int main() {
    foo() = 77;
}
```

<--->

...4 rvalue-reference become a xvalue expression:

```c++
// the most famous example being std::move
vector<int> foo{3,2,1};
vector<int> bar = std::move(foo)
```

{{</columns>}}


## Move Mechanics

Purpose of the new division of value category is that, now overload resolution depends on

1. type of argument expression

    - for member functions, dynamic type of the first argumnent (i.e. `this`) (single dynamic dispatch), and static type of the rest
    - for free functions, static type of each argument expression (static dispatch)
    
    Both (?) may involve Koenig lookup

2. if (1) still resolves to multiple candidates, which only differs by l/rvalue-ness of *reference* parameters, the following rules further applies

    From the client's (caller's) perspective:
    - lvalue expression argument invokes the one with (non-downgrading const-ness) lvalue reference parameter.
    - rvalue (prvalue or xvalue) expression argument invokes
        1. the overload with rvalue-reference parameter; or if no such overload is found, 
        2. the overload with **const** lvalue-reference parameter
            - this is the good old behavior for convenience since C++'s early days; it would be weird if `void foo(const std::string &s)` can't take a literal string.

    Or reversely, from the library's (callee's) perspective:
    - const lvalue refence parameter can bind to everything.
    - non-const lvalue reference parameter can only bind to lvalue expression argument.
    - rvalue reference parameter can only bind to rvalue expression argument.

Plus, returning a function-local object by value now enables move semantics automatically.

## Rvalue reference to raw pointer (as parameter) doesn't make sense

```c++
#include <cstdio>
#include <utility>

class RAIIFile {
    public:
        RAIIFile(std::FILE *&&f):file{f} { }
        ~RAIIFile(){/*std::fclose and handle error*/}
    private:
        std::FILE *file;
};

int main(void) {
    std::FILE *etc = std::fopen("/etc/fstab", "r");
    // RAIIFile f{etc}; // ill-formed program: cannot bind rvalue reference of type ‘FILE*&&’ to lvalue of type ‘FILE*’
    RAIIFile f{std::move(etc)}; // ok
}
```

In the snippet above, RAIIFile ctor takes a rvalue reference to raw pointer as parameter.
The merit is this would force the client to provide a rvalue expression argument.

- if the client uses a prvalue expression, this forbids him from using a named raw pointer on stack
- if he uses a named raw pointer, this force him to use `std::move`, which reminds him that "ownership" has been transferred.

("ownership" is quoted since technically speaking [holding a raw pointer is not considered *owning* the pointed resource](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r3-a-raw-pointer-a-t-is-non-owning))

But essentially that merit is inherent in rvalue reference & move semantics, and has nothing to do with raw pointer.
In fact, using rvalue reference to raw pointer NEVER makes sense. The design above will be better if `RAIIFile` ctor takes an `unique_ptr` by value.

In this example, replace `RAIIFile` totally with an `unique_ptr` instantiation with custom deleter *is not recommended*, since the execution of deleter is usually part of stack unwinding during which throwing exception is forbidden; i.e. client will have no chance to handle `fclose` error.

See [this](https://stackoverflow.com/questions/130117/if-you-shouldnt-throw-exceptions-in-a-destructor-how-do-you-handle-errors-in-i) for the necessity of `RAIIFile` and a better pattern.

## API design under move semantics

### From intent's perspective

For parameter type `T`
- if public API intends to assume **exclusive** ownership
