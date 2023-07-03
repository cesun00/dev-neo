---
title: "JVM Memory Arrangement"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

As a VM specification, JVMS prefers not to build the discussion upon actual OS memory segmentation.
Instead, the specification about memory is limited to 
a few explicitly identified and named logical memory regions, 
leaving the actual arrangement runtime of OS segmentation unspecified.

According to `§2.5`, a conforming JVM behaves *as if* the following memory area exists:
1. per-thread `PC` registers
2. per-thread JVM stacks
3. heap
4. method area
5. runtime constant pool
6. per-thread native method stacks (a.k.a C stack)

Specifically, JVMS says nothing about the so-called *direct memory* area.
Certain JVM implementations use the term *direct memory* to refer to OS native segments created by the `mmap(2)` syscall and later delivered
to JVM or JNI program via library calls e.g. `malloc(3)`.
Existence of such regions is highly implementation-specific.
These regions are in memory of native host machine, not of the Java virtual machine.

{{<card "pink">}}
as if rule these region exists....
{{</card>}}


<!-- TODO: https://docs.oracle.com/javase/8/docs/api/java/nio/ByteBuffer.html
java 4 nio -->

## per-thread `PC` registers

Each java thread has its own PC "register". When a thread is executing java code, PC stores the address of JVM instruction that is currently executing. When executing a `native` method, its value is undefined. JVMS 15 requires the width of a PC register to be "wide enough to hold a `returnAddress` or a native pointer on the specific platform".

## per-thread JVM stacks
