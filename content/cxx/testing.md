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

