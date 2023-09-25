---
title: "Task management Syscalls"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- Linux
- kernel
---

## clone / clone3

Without further flags, `clone()` does one simple thing: shallow copy a `task_struct` instance (via `dup_task_struct()` function in `fork.c`), and assign the `pid` and `stack` field a new value.
`clone3` is clone's extensible successor TODO. There was once a syscall, `clone2`, only available on the IA64 architecture.
It's now permanently removed from the mainstream kernel release.

The consequence is that 2 tasks now exist but shares most resources, since all the pointers within a `task_struct` are just shallow-copied.
A complex of flags can be used to determine what resources should be further deep-copied, thus

{{<columns>}}

<--->

`clone3()` works 

```c
/**
 * sys_clone3 - create a new process with specific properties
 * @uargs: argument structure
 * @size:  size of @uargs
 *
 * clone3() is the extensible successor to clone()/clone2().
