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
