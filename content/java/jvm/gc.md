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

Metaspace doesn't have a default upper bound (other than the size of the physical memory available), unless user specifies that manually on the CLI.

```txt
-XX:MetaspaceSize=size
-XX:MaxMetaspaceSize=size
```



GC Algorithms
-------------------

### Mark and Sweep

GC Triggering
------------

https://stackoverflow.com/questions/39932939/what-cause-objects-to-move-from-young-generation-to-old-generation

1. When eden is full, a minor GC is issued.

    What a minor GC do are:
    1. All garbages in eden is collected, copy all remaining objects in eden to S0 with age=1.
    2. All garbages in S1 is collected, copy all remaining objects in S1 to S0 with age = age + 1.
    3. When S0 is not large enough to contains object in the above 2 steps, a full GC is triggered.
    4. If any object in S0 now has age > threahold (16 by default), it is moved to the Old Gen.
    5. Role of S0 and S1 ans swapped, so the next minor GC we copy in the other direction.

    Why we need 2 survivor spaces:
    1. Decrease the # of objects we move to old gen; thus decrease the speed old space is filled, and decrease the chance of Major GC.
