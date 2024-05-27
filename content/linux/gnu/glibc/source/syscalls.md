---
title: "Linux Syscall Wrappers"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

GLIBC provides Linux syscalls wrappers a userspace programmer can use in C code, e.g. `read(2) / write(2)`.
This article discusses these wrappers are implemented.

<!--more-->

The syscall wrappers submodule is system-dependent, thus resides in the `sysdeps/unix/sysv/linux` directory.
We will be starting with the iconic `write(2)` syscalls implemented in the `write.c` file:

```c
#include <unistd.h>
#include <sysdep-cancel.h>

/* Write NBYTES of BUF to FD.  Return the number written, or -1.  */
ssize_t
__libc_write (int fd, const void *buf, size_t nbytes)
{
  return SYSCALL_CANCEL (write, fd, buf, nbytes);
}
libc_hidden_def (__libc_write)

weak_alias (__libc_write, __write)
libc_hidden_weak (__write)
weak_alias (__libc_write, write)
libc_hidden_weak (write)
```

`SYSCALL_CANCEL` is defined as:

```c
#define SYSCALL_CANCEL(...) \
  ({									     \
    long int sc_ret;							     \
    if (NO_SYSCALL_CANCEL_CHECKING)					     \
      sc_ret = INLINE_SYSCALL_CALL (__VA_ARGS__); 			     \
    else								     \
      {									     \
	int sc_cancel_oldtype = LIBC_CANCEL_ASYNC ();			     \
	sc_ret = INLINE_SYSCALL_CALL (__VA_ARGS__);			     \
        LIBC_CANCEL_RESET (sc_cancel_oldtype);				     \
      }									     \
    sc_ret;								     \
  })
```

That is, it wraps around another macro `INLINE_SYSCALL_CALL` and adds a cancellation point before making a syscall
since syscall is uninterruptable and entering kernel mode requires privilege ring elevation which can be expensive.

`INLINE_SYSCALL_CALL` is defined as:

```c
