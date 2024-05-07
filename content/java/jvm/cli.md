---
title: "JVM Launcher CLI Options"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

By the time of this writing, there is currently no JSR({{<ref "../admin.md#jsr">}}) document (not even a [JEP]({{<ref "../admin.md#jep">}}))
that standardizes the command-line options for the `java` JVM launcher.
This leaves the CLI interface to JVM invocation completely implementation-specific.

It is claimed that 

All `java` command line options can be equivalently passed via the `JDK_JAVA_OPTIONS` env var.


OpenJDK HotSpot CLI Flags
-----------

### Standard Options

### Extra Options

### Advanced Options

-----------------

Flags prefixed by `-X` are extra options; Flags prefixed by `-XX:` are further advanced options for JVM.

## heap size

k/K, m/M, g/G suffix unit are supported, and stand for mean 10-based kilobytes/megabytes/gigabytes. If no suffix, the unit is byte.

- `Xms size`: specify both min and initial size of heap.

    Must be a multiple of 1024 and greater than 1MB. `-XX:MinHeapSize` and `-XX:InitialHeapSize` gives you control of higher granularity than this flag.

- `-Xmx size`: max size of heap.

    Must be a multiple of 1024 and greater than 2MB.

## VM stack size

Each JVM thread has its private stack space, its size defaults to 1MiB, and can be changed by 

- `-Xss size`
    
    `size` is in bytes, and can has unit suffix `kK/mM/gG` for KiB/MiB/GiB.

- `-XX:ThreadStackSize=size`

    Similar to `-Xss`, except that `size` here is in KiB without suffix. So `-XX:threadStackSize=1024k` set the stack size per thread to 1 MiB.