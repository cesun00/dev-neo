---
title: "JDK & JVM source Analysis"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

In 2020, the development of OpenJDK has moved from mercurial, self-hosted at https://hg.openjdk.org/jdk/jdk, to Git, on GitHub: https://github.com/openjdk/jdk. There are even 2 JEPs for this:
- https://openjdk.org/jeps/357
- https://openjdk.org/jeps/369

There is also a redirecting URL https://git.openjdk.org/ that forwards you to the GitHub.

```
src
    hotspot     The Java virtual machine .C++ code.
```
