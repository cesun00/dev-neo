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
