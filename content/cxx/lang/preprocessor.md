---
title: "GNU CPP: the C/C++ Preprocessor"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

GCC C/C++ shares the same preprocessor program `cpp`. Several of its primary functionalities are discussed.

<!--more-->

Search for headers
---------------

### Standard header search pathes

Standard header search pathes can be found by:

```sh
# gcc -v -xc /dev/null |& grep -A 8 'search starts'
#include "..." search starts here:
#include <...> search starts here:
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include
 /usr/local/include
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include-fixed
 /usr/include
End of search list.
GNU C17 (GCC) version 10.2.0 (x86_64-pc-linux-gnu)
	compiled by GNU C version 10.2.0, GMP version 6.2.0, MPFR version 4.1.0, MPC version 1.1.0, isl version isl-0.21-GMP

# gcc -v -xc++ /dev/null |& grep -A 8 'search starts'
#include "..." search starts here:
#include <...> search starts here:
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/../../../../include/c++/10.2.0
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/../../../../include/c++/10.2.0/x86_64-pc-linux-gnu
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/../../../../include/c++/10.2.0/backward
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include
 /usr/local/include
 /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include-fixed
 /usr/include
End of search list.
```

Note that when compiling for C++, C++-specific headers are always in the front.

Among those header search paths:

1. `/usr/local/include` can be changed by the `--with-local-prefix=dirname` flag of the `configure` script when buliding gcc.
2. `/usr/include` can be changed by the `--with-native-system-header-dir=dirname` flag of the `configure` script when buliding gcc.
3. I think `/usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include` and `/usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/include-fixed`, and the ordering of the paths, are hardcoded into `cpp`. And C++-specific header paths are passed to `cpp` by `cc1plus` upon fork-exec. The built-in specs of gcc does not have flags for these.

`-nostdinc++` turns off all C++ specific standard header search path. `-nostdinc` turns off all standard header search path, leaving a blank start for the CLI flags controlling header search path listed below.


### CLI flags that affects header search

Quote include search starts from 1.

Angle bracket include search starts from 3.

1. The current directory of the source file.
2. `-iquote` left to right.
3. `-I` left to right.
4. `-isystem` left to right.
5. Standard header search paths.
6. `-idirafter` left to right.



## Macro Expansion

- Object-like macro, e.g. `#define A (X,Y,Z)`, establish a rule of replacement between a preprocessor token `X` and an ordered list of preprocessor tokens `X COMMA Y COMMA Z`.
- Function-like macro, e.g. `#define A(X) (X,Y,Z)`, is simply a parameterized object-like macro.

Those rules of replacement are between preprocessor tokens. Recursive expansion happens *lazily* only upon the invocation of a macro (regardless object / function macro): its expansion replaces the i7

```c
// It's okay to have undefined BAR when `#define FOO`, ...

