---
title: "MEMO: C++ Core Guidelines (CCG)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---


https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# C.20: If you can avoid defining default operations, do.

*rule of zero*:
- Make a clear separation in mind between (1) resource-managing class, a.k.a (not precise, but) RAII class and (2) everything else (e.g. business related class)
- (1) should having no more public APIs other than the big 5, and optionally a raw resource getter. One seldom needs to write their own (1). STL containers and smart pointer with custom deleter should suffice. But rare cases like RAII wrapper around `std::FILE*` exists, and smart pointer can't satisfy exception handling.
- In (2), Never write the big 5;
