---
title: "Makefile as a Dependency Description Language"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- Linux
- GNU
- Makefile
- Make
---

- https://www.gnu.org/software/make/manual/html_node/Double_002dColon.html
- https://www.gnu.org/software/make/manual/html_node/Remaking-Makefiles.html

The `Makefile` language can be divided into 2 parts, a dependency description language,
and a scripting language including constructs like functions, variables, loops, branching etc.

This article discusses everything about the Dependency Description ability of a Makefile.
See [TODO](#TODO) for the scripting part.

<!--more-->

## (Explicit) Rules

The unit of dependency description is *explicit rules* (often, just *rules*). A rule has the following syntax:

```makefile
# each structure below is named a "rule"
target: prerequisites
    recipe

# e.g.
foo.o: foo.c
        $(CC) -Iinclude/ -Iarch/x86/include foo.c
```

An explicit rule describes when and how to remake one or more files, called the rule’s targets. It lists the other files that the targets depend on, called the prerequisites of the target, and may also give a recipe to use to create or update the targets.

