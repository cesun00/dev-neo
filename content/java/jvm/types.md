---
title: "JVM Data Types"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Java is not the only language that runs on JVM.
To be independent from various upper-level languages, JVM has its own standalone concept of data types.
These data types are spoken by the JVM instructions.
e.g. `iadd / ladd / fadd / dadd` requires their operand to be of type `int / long / float / double`, and `jsr / ret / jsr_w` instructions require their operand to be of type `returnAddress`.

Below, real types (i.e. the leaf node) are listed in monospace font, while their categories (branch node) are not.

- primitive types
    - numeric types
        - integral types: these are integers encoded using *two's-complement*
            - `byte`: signed 8-bit
            - `short`: signed 16-bit
            - `int`: signed 32-bit
            - `long`: signed 64-bit
            - `char`: unsigned 16-bit, for storing UTF-16-encoded Unicode codepoint only.
        - floating-point types
            - `float`: IEEE 754 binary32 format
            - `double`: IEEE 754 binary64 format
    - `boolean`
    - `returnAddress`: pointers to opcodes of JVM instruction.
- reference types: pointers to heap-allocated ...
    - class types: ... class instances
    - array types: ... array instances
    - interface types: ... interface instances

