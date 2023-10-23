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











































We don't live in that ideal world.
Even if programmers are willing to always write modular Java from now on and keep existing projects on JVM 8 forever,
legacy libraries exist and people must be allowed to use them on Java 9.

Intuitively, some interoperability must exist between Java 8 and 9.
But let's first clarify what that means by making the following observations:

1. At runtime, the JVM version and SDK version must be the same.

    JVM 9 must load `lib/modules` and JVM 8 must load `rt.jar`.

    - it's impossible to load Java 8's `rt.jar` into JVM 9 and override the default bootstrap classes.
        the `-Xbootclasspath/a` allows appends but not override.
    - it's impossible to load Java 9's `lib/modules` image into JVM 8 since the format is unknown to it.

    We referred to the runtime JVM and SDK versions collectively as the *runtime version* below.

2. Cross-compilation alone doesn't introduce compatibility issues.

    JDK 9 `javac` can generate bytecode for running on JVM 8 with the `--release 8` option.
    The output classes will work well with `rt.jar` at runtime, despite that JDK 9 only has `lib/modules`.
    It's the JDK vendor's responsibility to ensure that a `javac` 9 behaves precisely the same as an 8 one in such a case.
    
    For that reason, we will not discuss cross-compilation, meaning that
    a `javac` is always generating bytecode for a JVM of the same version, collectively referred to
    as the *compile-time version* below.


These observations ruled out some impossible scenarios. We also won't be talking about hacking:
If a project is module-oriented, build it with JDK 9, respect the module paradigm, and run it with JVM 9.
Building it with JDK 9 but ignoring the use of modules (as if it was Java 8 source), or with JDK 8,
is not possible without hacking.

Finally, our intuition boils down to only 2 scenarios, which must be supported by Java 9:

| source paradigm      | compiled with \* | runtime version \* | scenario                              |
|----------------------|------------------|--------------------|---------------------------------------|
| classes (non-module) | 8                | 9                  | Legacy jar runs on JVM 9              |
| classes (non-module) | 9                | 9                  | Legacy source build & run with Java 9 |

- \* compile-time version: `javac` & compile-time SDK & bytecode target JVM version
- \* runtime version: JVM & runtime SDK version

Legacy jar runs on JVM 9
===============

Legacy jars are built from non-modular projects and delivered without `module-info.class`.

```sh
# java 8:
java -cp my-legacy-app.jar com.example.App

# java 9:
java -cp my-legacy-app.jar com.example.App
```

To fit them into the universe of observable modules, the concept of *unnamed module* is introduced.


Legacy source build & run with Java 9
===============


















JAR
==========
<!-- 
This section only talks about jar, which is still the most useful storage & runtime format.
jmod, only useful as a class file distribution format used by jlink, is discussed in the next chapter. -->



Legacy jar load & run on new JVM with modular runtime SDK
-----------


2. Bytecode (instruction) backward compatibility

    Individual bytecode in JVM8-targeting class files should be executed by a JVM 9 or higher as if by a JVM 8.

    Good news is that such conern is trivial: backward compatibility of bytecode has always been an important feature Java designers try to maintain.

Non-modular source compiled for & run on Java 9
--------------

1. Class files generated by a Java 8 compiler refer to types from the standard Java library that now reside in individual Java 9 modules. Such class files must still work when loaded by a Java 9 JVM as if by a Java 8 JVM.

2. It would be nice if a Java 9 module works on a Java 8 JVM as if 
