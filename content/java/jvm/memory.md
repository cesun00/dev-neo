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

JVM stacks are equivalent to the call stacks of conventional programming languages.
It was historically known as the *Java stack* when Java was the only guest language running on JVM,
while the native method stack was known as the *C stack* 
implying the fact that JNI methods are usually implemented in the C language.

Each JVM thread has its own JVM stack.
Each unit of the JVM stack is called a *frame*, storing local variables and the return address.
As expected, a new frame is piled on the stack when a function is invoked,
which gets destroyed later when the function returns.

Some JVMS considerations:
- JVMS allows JVM stacks to be allocated in the JVM heap - see below.
- JVMS allows JVM stacks to have non-contiguous memory.
- JVMS allows a stack to either have a fixed size limit or grow dynamically when necessary; leaving the choice under the implementation's jurisdiction.

    - If the implementation goes with fixed-size stacks, it MUST throw a `StackOverflowError` if no new frame can be created due to the size limit.
    - If the implementation goes with expandable stacks, it MUST throw a `OutOfMemoryError` if no new frame can be created due to insufficient memory for the reallocation.

    Oracle's HotSpot and OpenJDK go with fixed-size stack.

## heap

The heap is where all class instances and arrays are allocated.

JVMS requires a garbage collection mechanism to exist that reclaims memory occupied by objects in the heap, 
but leaves everything else about the GC mechanism unspecified.

- JVMS allows the JVM heap to have non-contiguous memory.
- Again, an conforming JVM may choose to use fixed-size heap or a expandable one. In either case ...

## method area

This area holds run-time representations of `.class` files.

GC is not mandatory for this area.
The memory of method area doesn't need to be contiguous.

## runtime constant pool

This area holds run time representation of the constant pool in `.class` files.

## per-thread native method stacks

This is 