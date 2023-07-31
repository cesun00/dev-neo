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
    - if parameter type is moveable: pass by rvalue reference `&&T`
    - else: pass `unique_ptr<T>` by value
- else if public API intends to assume **shared** ownership:
- else, `T` is copyable and the unique-ness of underlying resources is NOT of concern (e.g.`std::string` and its `char[]`). Ownership semantics is irrelevent. 
    - If        API implementation intends to keep a copy of the argument (e.g. a class ctor): pass by value (invoke copy ctor), and move construct the local copy.
    - else if   API implementation intends to access the argument readonly: pass by lvalue reference-to-const
    - else if   API implementation intends to modify the argument in-place: Avoid such design.

### From form's perspective

- Pass by: lvalue reference
- Pass by: lvalue reference-to-const
- Pass by: rvalue reference
- Pass by: value, move-able type
    - then move: ... ; see clang-tidy's `modernize-pass-by-value`
- Pass by: value, unmove-able type

## pass by `unique_ptr` vs pass by rvalue reference

What type should parameter of public API be in order to clearify the intent of ownership assumption?

- use `&&T` when you can (i.e. when `T` is move-able), 
- use `unique_ptr<T>` when you must (transfer of exclusive ownership, but class is not movable).

Both express the intent of ownership transfer.
- `unique_ptr` forced a heap allocated object to be used.
- `&&T` allows a stack allocated instanced to be moved in. If client has an `unique_ptr` instead, he can always pass in `*up.release()`.

## pass by value VS pass by lvalue / rvalue reference

It's now recommended to pass object by value and move-construct in member initializer list. Rationales are:
- Client now doesn't need to worry about his own object being changed, since a copy is send, rather than reference to the original object
- TODO: performance ...

```c++
FileHolder::FileHolder(std::filesystem::path p) : path{std::move(p)}, f{std::fopen(path.c_str(), "r")} {
	// ...
}
```

## scenario for rvalue function invocation

Call to a function becomes an rvalue expression if the function return rvalue reference. This is useful when ... TODO

## How to pass smart pointer around (function arguments / function return / etc.)

Guideline:

- Always consider ownership semantics first. Just because a function needs an `unique_ptr`-managed resources to work doesn't means you should make it `shared_ptr` and pass the `shared_ptr` around.
- Don't pass around raw pointer (and reference to it) in modern C++ code.
    - The only exception should be interfacing with legacy API. See Scott's `Item 15: Provide access to raw resources in resource-managing classes.`
- Avoid reference to smart pointer.


In action:

- Pass around `unique_ptr`-managed resource by native reference to that resources.
    - If `unique_ptr` destructs and that reference dangles - let it be. It's a bug in your program and you don't fix it by distorting the ownership semantics. Find ways to guarantee the lifetime of that resources instead.


## TODO: untitled

rvalue (prvalue and xvalue) expression as argument of a function call will match function overloads that takes a rvalue reference.

`decltype<t> t2 = std::move(t)` return (cast t to?) a rvalue reference so the expression itself is a rvalue expression, so the fucking move assignment operator get fucking fired instead of the plain old copy assignment opeartor.

done.


```c++
#include <cstdio>
void foo(int &x) {
    printf("%s\n", "lv ref");
}

void foo(int &&x) {
    printf("%s\n", "RVALUE ref");
}

int &lv() {
    int *c = new int{42};
    return *c;
}

int &&rv() {
    return 3+2;
}

int main() {
    foo(lv()); // lv ref
    foo(rv()); // RVALUE ref
    int &&gg = rv();
    foo(gg); // lv ref
}
```

<!-- ## if xvalue expression fire rv-ref overload, and prvalue expression fire rv-ref overload too, why differentiating these two? -->

## The expression after the return keyword is implicit treated as a rvalue

https://stackoverflow.com/questions/4986673/c11-rvalues-and-move-semantics-confusion-return-statement
"Please do not return local variables by reference, ever. An rvalue reference is still a reference."


## Rare case when return a rvalue ref is useful

https://stackoverflow.com/questions/5770253/is-there-any-case-where-a-return-of-a-rvalue-reference-is-useful


## reuse a moved container

https://stackoverflow.com/questions/9168823/reusing-a-moved-container

Technically when the moving `x.push_back()` is called (thus work on y destructively), the lifetime of `y` is far from ending; but's it's still okay to do the following. It avoid creating a vector<int> inside the loop every round. Also mind the moved-from vector problem.

```c++
#include <utility>
#include <vector>

using std::vector;

#include <cstdio>
#include <stdio_ext.h>


void print_vec(const vector<int> &vec) {
    for (const int x: vec) {
        printf("%d\t",x);
    }
    putchar('\n');
}

int main() {
    __fsetlocking(stdout,FSETLOCKING_BYCALLER);
    vector<vector<int>> x;
    vector<int> y;
    for (int i=0;i<10;i++) {
        y.clear(); // so call clear manually
        for (int j=0;j<10;j++) {
            y.push_back((i<<8) + j);
        }
        x.push_back(std::move(y));
        // the moved-from vector is not always empty:
        // https://stackoverflow.com/questions/17730689/is-a-moved-from-vector-always-empty
    }
    for (const auto &vec:x) {
        print_vec(vec);
    }
}
```