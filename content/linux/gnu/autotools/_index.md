---
title: "GNU Autotools"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

In the very beginning of open source project practice people manually write scripts that setup the build system

-----

![](./autotools_flow.gif)

the `autoconf` package
===========

https://www.gnu.org/software/autoconf/

The `autoconf` package install the following binary in `/usr/bin`:

The primary responsibility of `automake` is to generate a `configure` script from a `configure.ac` file.

The generated `configure` upon invocation will:
1. instantiate an existing `Makefile.in` into an actual `Makefile`.
2. TODO
3. ...

- `autoscan`: creates `configure.ac` prototype

    Program `autoscan` scans current working directory for C/C++ sources that may causes compatibility problems, and generates a `configure.scan` file. Users are supposed to check and modify that file, and rename it to `configure.ac`. Specifically, `AC_CONFIG_HEADERS` for a `config.h.in` and `AC_CONFIG_FILES` for Makefiles won't be generated, and requires manual interference.

- `autoheader`: 
- `autom4te`: 
- `autoconf`: 
- `autoreconf`: 
