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

Creating a task 


## Task Switching

Switching the CPU from executing one task to executing another can occur as the result of either
an interrupt or an inter-task CALL, JMP or IRET.

A task switch may occur in one of four ways:
1. The destination selector of a long JMP or CALL instruction refers to a TSS descriptor. The offset
portion of the destination address is ignored.
2. An IRET instruction is executed when the NT bit in the flag word = 1. The new task TSS
selector is in the back link field of the current TSS.
3. The destination selector of a long JMP or CALL instruction refers to a task gate. The offset
portion of the destination address is ignored. The new task TSS selector is in the gate. (See section
8.5 for more information on task gates.)
4. An interrupt occurs. This interrupt's vector refers to a task gate in the interrupt descriptor table.
The new task TSS selector is in the gate. See section 9.4 for more information on interrupt tasks.

All of these are known as task-switching operations, and has the following effect:
1. reload `LDTR` register
2. 

## 80286

A new register `TR` - the Task Register - was introduced.
Like the descriptor table registers, it has the following structure:

`TR`  is only accessible via `STR` and `LTR` instructions.
`TR` is visible to the programmer as a 16-bit selector.

The selector part identifies an descriptor in the GDT.

<!-- A full task-switch takes 22 microseconds at 8 MHz. -->
