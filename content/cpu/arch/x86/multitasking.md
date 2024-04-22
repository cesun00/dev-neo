---
title: "x86 Task Management"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

This articles discuss hardware-based task management in 16-bit and 32-bit x86.

Task management is significantly different in the AMD64 architecture, and is completely implemented in software.
See TODO for that.

x86 CPU hardware understood tasks since 80286.
<!-- Windows process / thread, and Linux task, are never concepts implemented only at the OS kernel level without support from hardware. -->

<!-- It's a shame for those who discussed task scheduling of certain OS / SDK / language runtime implementations without mentioning
how hardware has already provided a convenient infrastructure for such scheduling to be implemented, due to either their ignorance or reluctance. -->

## Task State Segment (TSS)

A TSS contains 44 bytes (22 words) for 80286, or 68 bytes for 386 and later.

{{/% <include-html ""> %/}}

TSS is only automatically manipulated by the CPU. There is no other way it can be written to or read from.
TSS is made up of 2 parts:
1. the static entries is fixed once the TSS is created (when the task is created)
2. the dynamic entries are modified every time the CPU is switching to a new task from the current task.

## Task Creation

