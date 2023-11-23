---
title: "Java Classfile Format"
date: 2024-01-01
lastmod: 2024-05-01
lastmod: 2024-05-24T13:06:57+08:00
draft: false
tags:
    - java
    - jvm
    - bytecode
---

This article aims to provide a concise and abbreviated overview of the Java classfile format according to Java 21.
<!--more-->

Readers are encouraged to explore [the JVMS 21 Chapter 4](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.1) for additional details not covered in this article.

While the content presented in this article is consistent with Java 21, most fundamental structures have remained unchanged since Java 7 and substantial modifications are unlikely to occur in the foreseeable future. The information here thus largely pertains to earlier and future releases as well.

## Before You Go

The following convention is used across the definition of classfile format:
- All multibyte integers are unsigned and stored in big-endianness; their type is denoted as `uN`. e.g. `u4` means a big-endian integer in `[0, 4294967295]`.
- Arrays are continuous storage of instances of the same type. An array is guarded by a prefix `uN` number that records its length.

Readers are encouraged to keep the following ideas in mind when studying the classfile structure:
1. a classfile needs not only to be executed by a JVM, but also provide enough information for source files to be compiled against it. A lot of information that is non-critical to runtime JVM is planted because of that.
2. Java is not the only language that compiles to a JVM bytecode. The classfile format has constructs that are meant to support other high-level languages or to make the virtual machine more extensible.

## Overview

The structure of a classfile binary can be described by the following C-like pseudo-struct:

```c
struct ClassFile {
    // 1. file metadata: magic and versions
    u4             magic;
    u2             minor_version;
    u2             major_version;

    // 2. the `constant pool` lookup table
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];

    // 3. type metadata: access, self, and unique parent
    u2             access_flags;
    u2             this_class;
    u2             super_class;

    // 4. implemented interfaces
    u2             interfaces_count;
    u2             interfaces[interfaces_count];

    // 5. fields
    u2             fields_count;
    field_info     fields[fields_count];

    // 6. methods
    u2             methods_count;
    method_info    methods[methods_count];

    // 7. class-level attributes
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
