---
title: "The Imperfect World: Mixing Modules and Non-Module Source & Binary in Java 9"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

In our [overview]({{<ref "./_index.md">}}), the module system was introduced as if Java 9
is a new language where a module is the only unit of development, compilation, and deployment.

This article takes a step back to the reality where non-modular practices exist and discusses how they are handled by Java 9.

Java 9 is completely module-oriented, meaning that 

meaning the module system creates a module from every JAR it finds
at all of compile time, link time, and run time. 


To accommodate non-modular JARs into the module system,
2 mechanics are introduced, namely *the unnamed module* and *automatic modules*.

Non-modular code exists for 2 major reasons:
1. legacy Java 8 oriented project
2. developers are unwilling to write modules in Java 9

We won't differentiate the reasons below, and refer to both case as non-modular code.

Java 9 must supports such practices; Specifically,
1. the old `--classpath` 



The Unnamed Module
============

If any classes are loaded via the old `--classpath` manner, they are put into a module known as the *unnamed module*, so that
they fit into *the universe of observable modules*, instead of as individual classes.

Those non-modular code doesn't have a `module-info.java`.
To cooperate with the module system, some rules apply:

1. The unnamed module `requires` every other observable module.

    This allows module-unaware code to use all `exports`-ed API from modules, including the modular JDK.

2. The unnamed module `exports` and `opens` all of its packages.

    > It does not, however, mean that code in a named module can access types in the unnamed module.
    > A named module cannot, in fact, even declare a dependence upon the unnamed module.

    

Automatic Modules
=============

If a non-modular jar, exploded or not, is loaded into the universe of observable modules by `--module-path` or alike,
it becomes a module automatically, known as an automatic module.

The name of an automatic module is determined by:
1. the jar file's `Automatic-Module-Name` header, if any; or
2. deriving from the jar file name on the filesystem

An automatic module
1. `requires` every other observable module, including the unnamed one
2. `exports` and `opens` all of its packages.




Compatibility consideration for Java 8
=============



The reverse is not supported in any sense, as forward compatibility is never a thing in Java.

 `ClassLoader` explicitly throws an exception when it finds a class file with a higher version than supported.
    e.g. Java 8 supports up to class file version 52:
    
    ```txt
    Error: A JNI error has occurred, please check your installation and try again
    Exception in thread "main" java.lang.UnsupportedClassVersionError: foo/App has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 52.0
    ```

    See [this table](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.1-200-B.2) from JVMS for 
    a mapping from Java versions to their supported class file version.

    Our intuition of interoperability is reduced to backward compatibility, where only JDK 9's support for Java 8 source & binary
    is required. Thus situations where `runtime version < compile-time version` are ruled out.










































