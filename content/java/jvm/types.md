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

{{<card>}}

Note that:
1. The `returnAddress` JVM data type is the only data type that is not directly associated with a Java language type.
2. IEEE754 defined positive and negative zeros,  positive and negative infinities, and a value of `NaN` - not a number.

    These value made their way into JVM as well: `NaN` is the result of certain invalid operations such as dividing zero by zero.

TODO: more on $2.3.2
{{</card>}}

## boolean 

Despite being a standalone type, `boolean` has very limited support in JVM.
There are no JVM instructions solely dedicated to operations on boolean values.
For Java, Java's `boolean` variables are compiled into JVM's `int`.

But this doesn't mean that JVM is not aware of the `boolean` type - the `newarray` instruction
can create a `boolean` array that maps to Java's `boolean[]`.
Such an array must be accessed via the `baload` and `bastore` instructions that operate on JVM's `byte` array.






