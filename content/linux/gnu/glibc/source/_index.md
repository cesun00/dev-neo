---
title: "GLIBC Source Analysis"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## `sysdeps/`

This directory contains OS-specific and CPU-specific code.
A CPU-specific directory contains OS-independent code.
Code that are both OS-dependent and CPU-dependnt are put within OS-spec 
Code in OS-specific directory will include headers in CPU-specific directory.

Whenever such inclusion is required, the OS-specific directory (e.g. `unix/sysv/linux`)
will have a CPU-named subdirectory (e.g. `unix/sysv/linux/`) that
1. 
2. contains code that CPU-specific and OS-specific

Unfortunately, both OS-specific directories (e.g. `unix/`) and CPU-specific directories (e.g. `x86`)
are presented as direct subdirectories of `sysdeps/`, making the layout somewhat confusing.

For a given CPU-specific directory, there are
1. `fpu/`: floating pointer coprocessor specific code
2. `ntpl`
3. `sysdep.h`

For a given OS-specific directory, there 
- include
- bits
