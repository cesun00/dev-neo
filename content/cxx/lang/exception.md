---
title: "Exception Infrastructure in C++"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

1. C++ allows an instance of arbitrary type to be thrown as exception. But always only throw liskov-able subclass of `std::exception`.
2. Throw by value, catch by reference (preferably to-const).

    ```c++
    try {
        // ... somewhere potentially deep down the calling stack
        throw std::DerivedException{};
    } catch(const std::BaseException &e) {
        // handle polymorphic e
    }
    ```

3. `catch(...)` is the syntax to catches everything, and caught object can't be referred. This should be seldom useful if (2) is followed.
4. If no matching `catch` block is found and `main` unwinds, `std::terminate` will be called.
5. There is no `finally` block in C++. Shouldn't be a problem if you follow RAII properly.
6. Never let exceptions escape from functions that are potentially part of the stack/scope unwinding. Common ones are 1) dtor 2) deleter of smart pointer 3) TODO.
7. Always check arguments to public API by using exceptions.

## controversy on the use of exception in C++

Application of exception in C++ is controversial for the following reason
1. Spec mandates several UB centering exception:
    1. Two exceptions propagating at the same time is UB: if the stack / scope is unwinding because of an exception is thrown, it's UB if another exception is thrown (due to dtor)
    2. 
2. C++ ABI is not standardized even in 2022 today. Interoperability with other langauge is not guaranteed. What if a C++ exception get thrown into C code?
3. https://docs.microsoft.com/en-us/cpp/cpp/errors-and-exception-handling-modern-cpp?view=msvc-170#exceptions-and-performance
    - <del>Performance is a more realistic concern in C++ than in other langauges. Throwing exception can be the bottleneck in performance-critical loops.</del>
    - (TODO: Exception throwing mechanism and how it affect performance.)


## Exception safe C++

There might be multiple callstack frames between 1) the frame executing the `throw` statement and 2) the frame where a proper `catch` handler is hit.
Function code between (1) and (2) is said to be *exception safe* if stack unwinds without leaving behind partially created objects, leaked memory, or data structures that are in unusable states.



There are at least 3 types of exception safety levels: basic, strong, and no-throw. Basic exception safety should be offered always as it is usually cheap to implement. Guaranteeing strong exception safety may not be possible in all the cases. The copy-and-swap idiom allows an assignment operator to be implemented elegantly with strong exception safety.


## standard exceptions


## Throwing Mechanics

## `noexcept()` & `throw()`

- `noexcept()` is introduced in C++11
- Don't use `throw()`. It's semantics experienced backward-incompatible & forward-incompatible changes.
    - `[c++11, c++17)` use the syntax to list types of potentially thrown object
    - `[c++17, c++20)` use the syntax as syntax sugar for `noexcept(false)`
    - REMOVED in c++20.

Function can declare whether it has the potential to throw an exception via the `noexcept(constant-expression)` specifier.

A function is said to be *potentially-throwing* if `constant-expression` evaluate to `false` **at compile time**, and *non-throwing* otherwise.

```c++
