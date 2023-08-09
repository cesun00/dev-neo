---
title: "Class loading & the java.lang.ClassLoader"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

A class loader is an object responsible for creating `Class<?>` instances by the binary name of a class.
The class of such object must be a subclass of the abstract class `java.lang.ClassLoader`. Among others, the most
important API is `public Class<?> loadClass(String name)` which converts an array of bytes into an instance of `Class<?>`.

First, bootstrap classes (was `rt.jar` prior to java 9) was found by looking at system property `sun.boot.class.path`, unless overridden by `-Xbootclasspath:`. The extension mechanism is deprecated and we ignore the loading of extension classes here.

*Note that `-Xbootclasspath:` overwrite the whole bootstrap classpath, while `-Xbootclasspath/a:` only append to the default bootstrap class (`/a` for "append" and `/p` for "prepend"). The first one is strongly deprecated and is not even documented in the latest man page.*

Then the user classes is searched on the user classpath. The user classpath is determined by:

1. The default value, `.`, meaning that user class files are all the class files in the current directory (or under it, if in a package).
2. The value of the `CLASSPATH` environment variable, which overrides the default value.
3. The value of the `-cp` or `-classpath` command line option, which overrides both the default value and the `CLASSPATH` value.
4. The JAR archive specified by the `-jar` option, which overrides all other values. If this option is used, all user classes must come from the specified archive.

https://docs.oracle.com/javase/8/docs/technotes/tools/findingclasses.html

## Class Loading Process

1. Loading: Ensure that a `.class` is loaded into the memory. This step create the `Class` object for currently loading class/interface.
2. Linking
    1. Verification

        Ensure that the `.class` binary follows the standard format, e.g. all JVM instructions are valid; branching (jmp) instruction jump to the start of some other instruction, rather than into the middle of an instruction.

    2. Preparation

        Allocate memory for `static` fields of the loading class, and initialize them to a *default value*.
        This always happens even if those static fields have initializer.

    3. (Optional) Resolution

        Resolve symbolic references to other class, optionally load them as well.
        2 variants:
        - Early resolution (think of static linking of a C program)
        - Lazy resolution (load the dependency class only when actively used)
        Implementations are free to decide to what extend lazy resolution are used.

3. Initialization
    1. the initializer expression of `static` field is executed, result assigned, and
    2. the static initializer blocks of a class is executed *in text order*.

### Timing of initialization

From JLS 15 12.4.1:

A class/interface `T` is initialized at the first occurrence of:
1. an instance of T is created
2. a static method of T is called
3. write to static field of T
4. read from non-final static field of T

This allows JVM to defer the initialization of static field as late as possible.
