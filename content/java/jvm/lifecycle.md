---
title: "JVM Lifecycle Analysis"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

- Loading is the process of finding the binary representation of a class or interface type with a particular name and creating a class or interface from that binary representation.
- Linking is the process of taking a class or interface and combining it into the run-time state of the Java Virtual Machine so that it can be executed.
- Initialization of a class or interface consists of executing the class or interface initialization method `<clinit>`


## JVM Exit

JVM Exit normally when all running threads are daemon threads.