---
title: "The History of Java: From Proprietary to Community-Driven"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## First Release

Sun Microsystems released [the first public implementation](https://web.archive.org/web/20070310235103/http://www.sun.com/smi/Press/sunflash/1996-01/sunflash.960123.10561.xml) as Java 1.0 in 1996, supporting Windows 95 and NT on Intel® and Solaris™ on SPARC™ platforms. You can get a Windows one [here](https://archive.org/details/javastarterkitjdk1.0).

The first release included
- a close-sourced, OS-native compiler `javac`
- a close-sourced, OS-native virtual machine `java` (interestingly called the *Java interpreter* in its release document).
- `classes.zip`: the compiled classes of `java.*` and `sun.*` packages
- `src.zip`: the source of `java.*`  packages (i.e. only `java.*` was open-sourced)
- various debugging and applet tools, all being close-sourced, OS-native binaries.

## Acquisition of Sun Microsystems by Oracle

## HotSpot

HotSpot, formally known as the Java HotSpot Performance Engine, was not a thing until 1999.
Essentially this term represented various improvements made by the Sun Microsystem to improve 
the performance of the original `java` program, specifically, instead of being a brand new creature.

## HotSpot JVM

https://github.com/openjdk/jdk/tree/master/src/hotspot

HotSpot was originally the name of the proprietary JVM of Oracle.
Now the term "HotSpot" usually refers to the open-source remake of the orignal HotSpot, which is part of the OpenJDK.

The name comes from a general concept in computer science called "hot spot". According to the Pareto Principle, 20% of the code consume 80% of the execution, and such frequently accessed region of code are known as "hot spots". The HotSpot JVM is released with a JIT compiler targeting those hot spots for optimization, thus the name.