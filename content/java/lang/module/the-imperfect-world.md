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
