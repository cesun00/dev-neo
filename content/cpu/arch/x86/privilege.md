---
title: "x86 Privilege Model"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

This article introduces the privilege mode of x86, characterized by the Ring 0 - 3 division of privilege levels of task.

- During the run of a task, the Current Privilege Level (CPL) of the task is given by the least significant two bits of the CS register.
- 
    - checking `DPL` in the access byte of code segment descriptor loading a new value into the `CS` register
    - checking `DPL` in the access byte of data segment descriptor

Lower ring code can't access higher ring's code and data.
High ring code can access lower's data but not call its code.

Operating system code and data segments placed at the most privileged level (0) cannot be accessed directly by programs at other privilege levels. Programs at privilege level 0 may access data at all other levels.
Programs at privilege levels 1-3 may only access data at the same or less trusted (numerically greater) privilege levels.

Task privilege is a dynamic value. It is derived from the code segment currently being executed. Task
privilege can change only when a control transfers to a different code segment.

Each task operates at only one privilege level at any given moment: namely that of the code segment
being executed.

The descriptor privilege attribute is stored in the access byte of a descriptor and is called the Descriptor Privilege Level (DPL). Task privilege is called the Current Privilege Level (CPL).

<!-- ## selector register

Loading a new selector into a relative register is a significant event in the privilege model.
Several checks are performed by hardware:

### load a new `CS` register: 
### load a new `SS` register:

Further memory access in the stack segment are presented in the form of offset.
- For an expand-down stack (ED=1):
- For an expand-up stack (ED=0):

### load a new `DS/ES` register:
### load a new ``

## Privilege Transition

```
EPL := max(caller CPL, )
``` -->