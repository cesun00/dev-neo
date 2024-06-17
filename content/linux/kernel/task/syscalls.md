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
 * It takes a struct as argument that is versioned by its size.
 *
 * Return: On success, a positive PID for the child process.
 *         On error, a negative errno number.
 */
SYSCALL_DEFINE2(clone3, struct clone_args __user *, uargs, size_t, size)
{
	int err;

	struct kernel_clone_args kargs;
	pid_t set_tid[MAX_PID_NS_LEVEL];

	kargs.set_tid = set_tid;

	err = copy_clone_args_from_user(&kargs, uargs, size);
	if (err)
		return err;

	if (!clone3_args_valid(&kargs))
		return -EINVAL;

	return kernel_clone(&kargs);
}
```

{{</columns>}}

```c
#ifdef __ARCH_WANT_SYS_CLONE
#ifdef CONFIG_CLONE_BACKWARDS
SYSCALL_DEFINE5(clone, unsigned long, clone_flags, unsigned long, newsp,
		 int __user *, parent_tidptr,
		 unsigned long, tls,
		 int __user *, child_tidptr)
#elif defined(CONFIG_CLONE_BACKWARDS2)
SYSCALL_DEFINE5(clone, unsigned long, newsp, unsigned long, clone_flags,
		 int __user *, parent_tidptr,
		 int __user *, child_tidptr,
		 unsigned long, tls)
#elif defined(CONFIG_CLONE_BACKWARDS3)
SYSCALL_DEFINE6(clone, unsigned long, clone_flags, unsigned long, newsp,
		int, stack_size,
		int __user *, parent_tidptr,
		int __user *, child_tidptr,
		unsigned long, tls)
#else
SYSCALL_DEFINE5(clone, unsigned long, clone_flags, unsigned long, newsp,
		 int __user *, parent_tidptr,
		 int __user *, child_tidptr,
		 unsigned long, tls)
#endif
{
	struct kernel_clone_args args = {
		.flags		= (lower_32_bits(clone_flags) & ~CSIGNAL),
		.pidfd		= parent_tidptr,
		.child_tid	= child_tidptr,
		.parent_tid	= parent_tidptr,
		.exit_signal	= (lower_32_bits(clone_flags) & CSIGNAL),
		.stack		= newsp,
		.tls		= tls,
	};

	return kernel_clone(&args);
}
#endif
```

{{<card "info">}}

<!-- The signature of glibc's `clone` wrapper uses variadic variables for TODO; 
this has nothing to do with the fact that syscalls use register-based arg passing.

Pass at least 4 arguments to use this syscal -->
This caused some trouble for the glibc's wrapper:

```c
extern int clone (
    int (*__fn) (void *__arg),
    void *__child_stack,
    int __flags,
    void *__arg,
    ...
) __attribute__ ((__nothrow__ , __leaf__));

int clone(int (*fn)(void *_Nullable), void *stack, int flags,
                 void *_Nullable arg, ...  /* pid_t *_Nullable parent_tid,
                                              void *_Nullable tls,
                                              pid_t *_Nullable child_tid */ );
```

The callee knowns the number of actually passed arguments, since ...TODO? Such technique is 
