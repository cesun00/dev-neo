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
```

## Magic and Versions

- `magic` must be `0xCAFEBABE`.
- `major_version`

    Indicates the target JVM version which this classfile is compiled to run on.

    The first Java release from Sun in 1996 has a compiler that generates `major_version=45` classfiles, and
    a JVM that loads and runs `major_version=45` classfiles.
    
    Each new Java version thereafter is shipped with:
    1. a JVM that supports incremented `major_version` (by 1) and all `major_version`s before; e.g. Java 11 JVM supports `major_version` from 45 to 55; and
    2. a `javac` compiler that by default generates classfiles with incremented `major_version` (by 1), but can be configured to generate smaller `major_version` targeting historical JVM (via the `-source` and `-target` CLI flag).

    See [this table](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.1-200-B.2) for correspondence between
    Java versions and `major_version`.

- `minor_version`

    - Before Java 12 (exclusively), `minor_version` can be any integer.    
    - Since Java 12 (inclusively, `major_version=56`), a class file that uses preview features must have `minor_version=65535`; otherwise, it must have `minor_version=0`. No other value of `minor_version` is allowed.

    Historically (before Java 12) this field doesn't have well-defined semantics, and all Java releases (except ancient ones before 1.2)
    have a different `major_version` with `minor_version=0`.
    
## `constant_pool[]` array: the constant pool

`ClassFile.constant_pool[]` is an array of `cp_info` instances and stores all sorts of constant values, known as the constant pool.

Each `cp_info` has the generic structure of:

```c
struct cp_info {
    u1 tag;
    u1 info[];
}
```

where `tag` determines the the type of this constant, and must be one of [the 17 pre-defined tags](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.4-210). Its value determines the internal structure of `info[]`.

{{<card "info">}}

For example, an `cp_info` with `tag = 1 (CONSTANT_Utf8)` becomes an `CONSTANT_Utf8_info`:

```c
struct CONSTANT_Utf8_info {
    u1 tag;             // must be 1
    u2 length;
    u1 bytes[length];   // UTF8-encoded bytes
}
```


{{</card>}}

The following table describes different `tag` values and their corresponding specialized `cp_info` structure.
Fields that end with `_index` is the index of an entry in the `constant_pool` array, which usually must be of a specific type, annotated in the comment.

{{<fold "table: cp_info tags synopsis.">}}
{{<wide>}}
{{<content/classfile/cpinfo>}}
{{</wide>}}
{{</fold>}}

**The constant pool is a critical part of a class file.**
Its entries are extensively referred to (by index) by other structures and bytecode instructions.
Whenever such references are made, 1-based indexes are used. To be precise:
1. A use of `index=0` indicates an invalid reference or is reserved for special semantics.
2. The very first entry in the `constant_pool` array is a valid constant that should be referred to as `index=1`.
3. The total number of entries in the `constant_pool` array is `constant_pool_count - 1`. (this is only case in the classfile format where array length is not equal to its preceding number)

## `attribute_info`: the heavy-duty structure

`attribute_info` is discussed first due to its fundamental role in the classfile.

Despite its name, the `attribute_info` structure is the real heavy-duty information carrier of a class file.
Among other critical runtime information, the bytecode instructions are delivered within `attribute_info` instances.

Its instances are extensively embedded in other structures in the clasfile, including
- the top-level `ClassFile`
- `field_info`
- `method_info`
- `Code_attribute` (sub structure of `method_info`)
- `record_component_info` (since Java 14)

An `attribute_info` instance has the following generic structure:

```c
struct attribute_info {
    u2 attribute_name_index;        // CONSTANT_Utf8_info (the attribute name)
    u4 attribute_length;
    u1 info[attribute_length];
}
```

where `attribute_name_index` locates an `CONSTANT_Utf8_info` in the constant pool, indicating the attribute name.
The attribute name must be one of 30 predefined attribute names, and determines the type of this `attribute_info` instance and the internal structure of the `info` array.

<!-- summarized below by their permitted context -->

<!-- Unless otherwise noted, the permitted number of instances of any attribute type is 0 or 1; i.e.  -->

{{<fold "table: attributes semantics synopsis.">}}
{{<content/classfile/attribute_new>}}
{{</fold>}}

{{<include-html "./multi_attr.html">}}

## Type Metadata

```c
struct ClassFile {
    // ...
    u2             access_flags;
    u2             this_class;      // CONSTANT_Class_info
    u2             super_class;     // 0 or CONSTANT_Class_info
    // ...
}
```

Although the semantics of `this_class` and `super_class` should be axiomatic.

1. a class can thus only have 1 parent at the JVM level. All high-level langauge that runs on JVM
2. Only `java.lang.Object` can have `super_class=0`, since it doesn't have a super class.

`access_flags` is a 16-bit bit flag field, whose bits are defined as:

{{<fold>}}

| flag menomics    | value                            | description                                                                       |
|------------------|----------------------------------|-----------------------------------------------------------------------------------|
| `ACC_PUBLIC`     | 0x0001: `0b 0000 0000 0000 0001` | Declared public; may be accessed from outside its package.                        |
| `ACC_FINAL`      | 0x0010: `0b 0000 0000 0001 0000` | Declared final; no subclasses allowed.                                            |
| `ACC_SUPER`      | 0x0020: `0b 0000 0000 0010 0000` | Treat superclass methods specially when invoked by the invokespecial instruction. |
| `ACC_INTERFACE`  | 0x0200: `0b 0000 0010 0000 0000` | Is an interface, not a class.                                                     |
| `ACC_ABSTRACT`   | 0x0400: `0b 0000 0100 0000 0000` | Declared abstract; must not be instantiated.                                      |
| `ACC_SYNTHETIC`  | 0x1000: `0b 0001 0000 0000 0000` | Declared synthetic; not present in the source code.                               |
| `ACC_ANNOTATION` | 0x2000: `0b 0010 0000 0000 0000` | Declared as an annotation interface.                                              |
| `ACC_ENUM`       | 0x4000: `0b 0100 0000 0000 0000` | Declared as an enum class.                                                        |
| `ACC_MODULE`     | 0x8000: `0b 1000 0000 0000 0000` | Is a module, not a class or interface.                                            |

{{</fold>}}

## `fields[]` array: fields of this class

`fields[]` in the `ClassFile` structure is an array of `field_info`, defined as:

```c
struct field_info {
    u2             access_flags;
    u2             name_index;          // CONSTANT_Utf8_info
    u2             descriptor_index;    // CONSTANT_Utf8_info
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

`access_flags` is a bit field that encodes the modifiers allowed on this field (in terms of Java). Defined bits are:

{{<fold>}}

| flag menomics   | value                            | description                                                                                                        |
|-----------------|----------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `ACC_PUBLIC`    | 0x0001: `0b 0000 0000 0000 0001` | Declared public; may be accessed from outside its package.                                                         |
| `ACC_PRIVATE`   | 0x0002: `0b 0000 0000 0000 0010` | Declared private; accessible only within the defining class and other classes belonging to the same nest (§5.4.4). |
| `ACC_PROTECTED` | 0x0004: `0b 0000 0000 0000 0100` | Declared protected; may be accessed within subclasses.                                                             |
| `ACC_STATIC`    | 0x0008: `0b 0000 0000 0000 1000` | Declared static.                                                                                                   |
| `ACC_FINAL`     | 0x0010: `0b 0000 0000 0001 0000` | Declared final; never directly assigned to after object construction (JLS §17.5).                                  |
| `ACC_VOLATILE`  | 0x0040: `0b 0000 0000 0100 0000` | Declared volatile; cannot be cached.                                                                               |
| `ACC_TRANSIENT` | 0x0080: `0b 0000 0000 1000 0000` | Declared transient; not written or read by a persistent object manager.                                            |
| `ACC_SYNTHETIC` | 0x1000: `0b 0001 0000 0000 0000` | Declared synthetic; not present in the source code.                                                                |
| `ACC_ENUM`      | 0x4000: `0b 0010 0000 0000 0000` | Declared as an element of an enum class.                                                                           |

{{</fold>}}

- `name_index` locates a `CONSTANT_Utf8_info` in the constant pool, i.e. the name of the field.
- `descriptor_index` locates a `CONSTANT_Utf8_info` in the constant pool, i.e. a descriptor that encodes the type of this field.
- The `attributes[]` array gives the attributes associated with this field. See TODO for allowed attributes here.

## `methods[]` arary: methods of this class

## Bookkeeping Strings: Names and Descriptors

A `CONSTANT_Utf8_info` constant stores strings for various purposes.
Only some of them are literal `String` content presented in the program text, 
while many others are bookkeeping information whose format is defined as contracts and understood by JVM.

