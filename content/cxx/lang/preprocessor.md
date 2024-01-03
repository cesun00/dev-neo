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
