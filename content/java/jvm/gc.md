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

The 6 JVM Run-Time Data Areas (PC register, heap, VM stack, native stack, method area, constant pool) divide the memory by functionality. This section divide the memory from the perspective of a garbage collector.

- Heap 1
    - Young Gen 1/3 of heap
        - Eden      8/10 of Young Gen
        - S0        1/10 of Young Gen
        - S1        1/10 of Young Gen
    - Old Gen  2/3 of heap
- Non-Heap
    - Perm Gen (before Java 8)
    - Metaspace (since Java 8, replace PermGen)

### Young Gen



### Perm Gen (before Java 8)

Permanent generatoin contains method area, loaded `.class` definitions, and the string constant pool.

https://stackoverflow.com/questions/9095748/method-area-and-permgen

The default maximum memory size for 32-bit JVM is 64 MB and 82 MB for the 64-bit version. It initial/min and max size can be changed by cli flags:

```txt
-XX:PermSize=[size]     the initial or minimum size of the PermGen space
-XX:MaxPermSize=[size]  the maximum size
```

*These flags are removed since Java 8, and an error will be issued upon invoke.*

Size of the PermGen also grow but there is an explicit upperbound. Since the max size of the PermGen is either defaulted or set by the user (i.e. upper bound exist), sometimes we get `OutOfMemoryError` due to the fact that PermGen is too large.

### Metaspace

Metaspace replaces PermGen since Java8, but they basically contains the same thing, i.e. method area, class definition, and string constant pool.

