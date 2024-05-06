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
#define INLINE_SYSCALL_CALL(...) \
  __INLINE_SYSCALL_DISP (__INLINE_SYSCALL, __VA_ARGS__)

#define __INLINE_SYSCALL_DISP(b,...) \
  __SYSCALL_CONCAT (b,__INLINE_SYSCALL_NARGS(__VA_ARGS__))(__VA_ARGS__)
```

<!-- There is a little trick going on here. The glibc team wants to use `SYSCALL_CANCEL` (and `INLINE_SYSCALL_CALL`) -->

where `__INLINE_SYSCALL_NARGS` computes the number of arguments collected in `...`, 
and `__SYSCALL_CONCAT` concate the original syscall name with the computed number of arguments.
In our `write` case, `INLINE_SYSCALL_CALL(write, fd, buf, nbytes)` intermediately expands to `__INLINE_SYSCALL3(write, fd, buf, nbytes)`.

(Its implementation uses an interesting trick similar to the [double-stringize trick](https://stackoverflow.com/questions/2751870/how-exactly-does-the-double-stringize-trick-work) to ensure the expansion of argument macros happens before the concatenation of tokens.)

`__INLINE_SYSCALLN()` are a collection of telescoping function macros:

```c
#define __INLINE_SYSCALL0(name) \
  INLINE_SYSCALL (name, 0)
#define __INLINE_SYSCALL1(name, a1) \
  INLINE_SYSCALL (name, 1, a1)
#define __INLINE_SYSCALL2(name, a1, a2) \
  INLINE_SYSCALL (name, 2, a1, a2)
#define __INLINE_SYSCALL3(name, a1, a2, a3) \
  INLINE_SYSCALL (name, 3, a1, a2, a3)
#define __INLINE_SYSCALL4(name, a1, a2, a3, a4) \
  INLINE_SYSCALL (name, 4, a1, a2, a3, a4)
#define __INLINE_SYSCALL5(name, a1, a2, a3, a4, a5) \
  INLINE_SYSCALL (name, 5, a1, a2, a3, a4, a5)
#define __INLINE_SYSCALL6(name, a1, a2, a3, a4, a5, a6) \
  INLINE_SYSCALL (name, 6, a1, a2, a3, a4, a5, a6)
#define __INLINE_SYSCALL7(name, a1, a2, a3, a4, a5, a6, a7) \
  INLINE_SYSCALL (name, 7, a1, a2, a3, a4, a5, a6, a7)
```

Finally, after all this detour, we reached at

```c
#define INLINE_SYSCALL(name, nr, args...) __syscall_##name (args)
```

which calls a real C function `__syscall_write(fd, buf, nbytes)`.

All the bothering above is a (sort of common black magic) pattern in the C preprocessor programming to overload a function macro on the number of arguments. [See this SO post for details.](https://stackoverflow.com/questions/11761703/overloading-macro-on-number-of-arguments)

Now let's look at how the C function `__syscall_write()` is implemented.

### `syscalls.list` and `make-syscalls.sh`


## misc





```c
/* Issue a syscall defined by syscall number plus any other argument
   required.  Any error will be returned unmodified (including errno).  */
#define INTERNAL_SYSCALL_CANCEL(...) \
  ({									     \
    long int sc_ret;							     \
    if (NO_SYSCALL_CANCEL_CHECKING) 					     \
      sc_ret = INTERNAL_SYSCALL_CALL (__VA_ARGS__); 			     \
