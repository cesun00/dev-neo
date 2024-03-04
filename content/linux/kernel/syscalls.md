---
title: "The Linux Syscalls"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

glibc dynamic syscall wrapper:

```c       
#include <unistd.h>

long syscall(long number, ...);
```

Mnemonic macros for `number` are defined in `<sys/syscall.h>`:

```c
#include <sys/syscall.h>
long syscall(SYS_clone3, struct clone_args *cl_args, size_t size);
```

## API layer

The system calls entrance point API layer of the linux kernel.

