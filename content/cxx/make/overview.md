---
title: "Makefile Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - GNU
    - make
    - Makefile
---

The `Makefile` language can be divided into 2 parts, a dependency description language,
and a scripting language including constructs like functions, variables, loops, branching etc.

The purpose of the scripting part of a Makefile is to
1. determine the value of variables at run time, which can be expanded in the dependency part.
2. conditionally enable or disable certain rules in the dependency part

The mixture of 2 languages in the same `Makefile` renders it a rather weird creature for beginners.

## include other makefiles

The `include` and `-include` directive instructs the parser to parse the mentioned files as if their content replaces the `include` directive. (Not really, see below.) The parsing of the current file is paused until the replacement is done. There is no more ad-hoc treatment.

This indicates that the paths (including targets and dependencies) within the `include`-ed files are interpreted relative to the CWD of the `make` process that is parsing the `include`-ing Makefile.

```makefile
