---
title: "Garbage Collection"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

{{<card pink>}}

## Warning

The garbage collection mechanism is BY NO MEANS standardized. JVM vendors are free to choose any GC algorithms, to the extent of having on GC at all.

{{</card>}}

Overview
-----------
1. The good old garbage collectors for HotSpot is "Serial Garbage Collector" and "Parallel Garbage Collector". The latter one is default in and before Java 8, and is recommended on devices that has multiple hardware threads.
2. Since Java 9, Hotspot switch to the "Garbage First Garbage Collector (G1GC)" as the default garbage collector.
2. An alternative to G1 is the "Concurrent Mark and Sweep" (CMS) garbage collector. It can be enabled by `-XX:+UseConcMarkSweepGC`.
3. Since Java 11, a new garbage collector "ZGC" is available, but is not yet the default as of Java 15. To enable ZGC, use `-XX:+UseZGC -Xmx<size> -Xlog:gc` one the `java` cli.

https://wiki.openjdk.java.net/display/zgc/Main#Main-JDK11
https://blog.csdn.net/weixin_32893479/article/details/114121218?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control


JVM Memory Partition from GC Perspective
--------

