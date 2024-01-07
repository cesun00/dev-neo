---
title: "GCC MISC"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - Linux
    - GCC
    - C
    - C++
---

### `cc1` and `cc1plus`

The output of `gcc -v` actually shows no invocation of the `cpp` preprocessor. Instead, `cc1`/`cc1plus` is invoked for both pre-processing and compilation of C/C++. My assumption is that those 2 programs fork-exec `cpp`.


GCC Developer Options
------------
- `-print-search-dirs`
- `-print-sysroot`
- `-print-prog-name`

    ```bash
    gcc -print-prog-name=cc1
