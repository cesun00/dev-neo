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
