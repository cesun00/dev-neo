---
title: "Testing in C/C++"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- testing
- C
- C++
---

JUnit and Mockito are the de-facto standard testing suites for Java; They are used by every company I know.
On the other side, there is hardly a standardized exercise for the C/C++ world on how software should be tested.

This article is an overview of various testing methodologies for software / library written in C/C++.

<!--more-->

<!-- ## Testing the final executables directly -->
<!-- TODO: find examples -->

## Extra executables just for test

Some extra executables are defined in `check_PROGRAMS`, thus built upon `make check`. Each of them usually consists of only a single `.c` file, and links against the main library.

Such executable often takes the name of input file from cli args, and 

e.g. libpng defines `check_PROGRAMS= pngtest pngunknown pngstest pngvalid pngimage pngcp`.

These executables sometimes has extra shell wrapper script to invoke them, i.e. `TEST = ` variable refers to those scripts, rather than the executables directly. e.g. `TESTS = tests/pngtest-all` which invokes `pngtest` binary multiple times.

Those test-specific executables are removed by binary-based package managers e.g. `pacman`.

Those executables are also free to choose testing protocols. E.g. `pngtest` use automake's naive protocol where a process exit status of 99 means a failed test.

## unit test

### in-place unit-test

Test functions, with conventional names (e.g. `test_*()`), are written in the same `.c` file of business code, and eventually get into the final `.a` binary.
A single `unit-tests.c` file then links against this static library, build into an executable `unit-tests`, calling all those `test_*()` functions.

- hardcode each test function name. Examples are GNU `wget`.

Consequently,
- Only a single executables exists that runs all unit test functions.

## homemade testing library

A static library `libtorture.a` is built first where `main()` function is defined, inside which it calls an external function of a conventional name e.g. `torture_run_tests()`.

Multiple `.c` files later defines function `torture_run_tests()`, and each of them, after linking against `libtorture.a`, becomes an executable known to the build system.

`libssh` does this with CMake. The same practice is a bit more annoying for autotools, since `check_PROGRAMS` must holds name of each executable, plus bolierplate for `*_SOURCES=` for each executable. User may want a `configure.ac` macros to facilitate this.
