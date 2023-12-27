---
title: "x86 Modes of Operation"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

The concept of operation modes was introduced in the Intel 80286, and 2 modes are defined:
1. a real-address mode (or real mode) exposes the physical memory address to CPU instructions.

    The real-address mode captures how the previous 80186 and 8086 work, and is characterized by
    1. a 20-bit segmented memory address space
    2. direct software access to peripheral hardware
    3. no concept of memory protection or multitasking at the hardware level

    Since 80286 and later, this mode is usually only used during machine startup.
    
2. a *protected virtual address mode* or simply protected mode enables features like segmentation, virtual memory, paging and safe multi-tasking.

    The protected mode may only be entered after the system software sets up one descriptor table and enables the Protection Enable (PE) bit in the `CR0` register (control register 0).

80386 invented the term *virtual 8086 mode*, which is not itself a global processor mode,
but a protected mode attribute that can be enabled for any task. It allows any 8086/8088/80186/80188 program
to be run as an 80386 task without modification, among other tasks, under the control of a 32-bit operating system.
The processor can switch repeatedly and rapidly between virtual-8086 mode and the native protected mode.

> The CPU enters V86 mode from protected mode to execute an
8086 program, then leaves V86 mode and enters protected mode to continue
executing a native 80386 program.

80386SL introduced a System Management Mode (SMM) for implementing platform-specific functions such as power management and system security.

The end of 32-bit modes. The takeaway is, since 2000, 32-bit x86 CPUs run in real mode only during boot, and then run in the protected mode forever.
There is seldom a chance for a 32-bit x86 CPU to encounter a legacy 16-bit program thus activating the virtual-8086 mode.

To the age of AMD64. One more mode is defined: Long Mode (in AMD's words), or IA-32e Mode (in Intel's words), which consists of 2 sub-modes:
1. Compatibility mode: allows 16-bit and 32-bit x86 applications to run, without recompilation, under control of a 64-bit operating system in long mode. (like what virtual-8086 mode does for 16-bit programs). In compatibility mode, segmentation functions just as it does in legacy IA-32 mode, using the 16-bit or 32-bit protected mode semantics.
