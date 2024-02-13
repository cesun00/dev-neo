---
title: "Variadic Arguments in C/C++"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Variadic Macro Functions

Preprocessors of gcc and clang supports variadic macro function. This feature is mandatory since C99 / C++11.

```c++
// An ellipsis as the last macro parameter becomes the sink.
// Use `__VA_ARGS__` to refer to whatever token sequence the sink accepts.
#define foo(...) real_foo(42, __VA_ARGS__)

// GNUCPP-specific named sink:
#define foo(bar...) real_foo(42, bar)

// Preceding normal arguments are allowed, with some problems
#define eprintf(format, ...) std::fprintf(stderr, format, __VA_ARGS__)

eprintf("hooray!");     // expansion error in all-time C and prior to C++20.
eprintf("hooray!", );   // Expands to   std::printf(format, );     and compiler will complain.


// C++20
// 1) implicitly assumes the argument comma if omitted; i.e. eprintf("hooray!") is equivalent to eprintf("hooray!", )
// 2) introduces `__VA_OPT__(X)` which expands to X if __VA_ARGS__ is not empty, or nothing otherwise.
#define eprintf(format, ...) std::fprintf(stderr, format __VA_OPT__(,) __VA_ARGS__)

eprintf("hooray!");             // expands to   std::fprintf(stderr, "hooray");
eprintf("%d hooray!", 42);      // expands to   std::fprintf(stderr, "%d hooray", 42);
```

## Function with Variadic Arguments

### in C

Variadic arguments in C is introduced by an ellipsis `...` in the function declaration
which must appear last in the parameter list and must follow at least one named parameter.
The `...` and the proceeding parameter must be delimited by a comma:

```c
int printx(const char* format, ...);
```

As the implementor of `printx`, do:

```c++
#include <cstdarg>

int printx(const char* fmt...) {
    // 1. Allocate an instance of va_list on stack.
    va_list args;
    // 2. Initialization.
    va_start(args, fmt);

    // 3. call va_arg with type
    int a = va_arg(args, int);
    double b = va_arg(args, double);
    const char *const c = va_arg(args, const char*);

    // 4. destruction
    va_end(args, fmt);
}
```

There is no limitation as for what can be used as arguments: primitive types, pointers, and `struct` instance.
If the callee `va_args()` failed to expect, dirty data is read, and your program booms.

### in C++

The leading comma is omitted from C++'s standard syntax, but writting one is still allowed for C compatibility.
C++ also allows variadic functions without leading named ordinary parameter, but portability of the compiled binary of such functions is not guaranteed.

```c++
int printx(const char* fmt...);
int printx(const char* fmt, ...); // same as above.
int printx(...); // allowed in C++ but not in C
```

#### access & implementation

```c++
#include <cstdarg>

int printx(const char* fmt...) {
    // 1. Allocate an instance of va_list on stack.
    va_list args;
    // 2. Initialization.
    va_start(args, fmt);

    // 3. call va_arg with type
    int a = va_arg(args, int);
    double b = va_arg(args, double);
    const char *const c = va_arg(args, const char*);

    // 4. destruction
    va_end(args, fmt);
}
```

1. `va_start` and `va_args` are macros. (mandated by spec?)
2. It's undefined behavior if `va_arg` is called when there are no more arguments in `va_list`.
3. Spec leave content of `va_list` unspecified. It has to be stateful (i.e. hold a cursor) in order to implement such API pattern.

    `sizeof(va_list)` under amd64 gcc is 24 bytes.

    ```c
    typedef __builtin_va_list __gnuc_va_list;
    typedef __gnuc_va_list va_list;
    ```

Variadic parameters are essentially unnnamed and untyped. Caller push whatever arguments onto its own (?) stack frame, and make a `callq` instruction on x86.