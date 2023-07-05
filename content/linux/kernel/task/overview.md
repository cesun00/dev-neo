---
title: "Overview: Linux Task Subsystem"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## Overview

A task has 
1. a pointer to its original parent (the one that forked it) and a pointer to its current parent (the one that receives `SIGCHLD`)

	There is no `setppid()` - the change of parent only happens when the parent process exit without `wait()`-ing on childern.
	Those orphan child processes change their current parent to the `pid 1` i.e. `init` or `systemd`.

2. a linked list of its siblings (the ones that its current parent forks)

- A task belongs to a *process group*.
- A task belongs to a process.
- A task belongs to a namespace.
- A task belongs to a cgroup (control group).


### zombie and orphan

- After a child task `exit`, if its parent is alive and has not call `wait()` on it, the child is known as a zombie. Zombie process appeared in the system is the problem of their parents. There is no specific name for such a parent afaik.
- regardless a child task `exit`-ed or not, if if its parent is `exit` already (indicating no `wait()` on the child is ever called),  the child is known as an orphan. Orphan processes are always re-parented to pid 1.

## primitive types

```c
// include/linux/types.h
typedef __kernel_pid_t		pid_t;

// include/uapi/asm-generic/posix_types.h
typedef int		__kernel_pid_t;
```

```c
/*
 * What is struct pid?
 *
 * A struct pid is the kernel's internal notion of a process identifier.
 * It refers to individual tasks, process groups, and sessions.  While
 * there are processes attached to it the struct pid lives in a hash
 * table, so it and then the processes that it refers to can be found
 * quickly from the numeric pid value.  The attached processes may be
 * quickly accessed by following pointers from struct pid.
 *
 * Storing pid_t values in the kernel and referring to them later has a
 * problem.  The process originally with that pid may have exited and the
 * pid allocator wrapped, and another process could have come along
 * and been assigned that pid.
 *
 * Referring to user space processes by holding a reference to struct
 * task_struct has a problem.  When the user space process exits
 * the now useless task_struct is still kept.  A task_struct plus a
 * stack consumes around 10K of low kernel memory.  More precisely
 * this is THREAD_SIZE + sizeof(struct task_struct).  By comparison
 * a struct pid is about 64 bytes.
 *
 * Holding a reference to struct pid solves both of these problems.
 * It is small so holding a reference does not consume a lot of
 * resources, and since a new struct pid is allocated when the numeric pid
 * value is reused (when pids wrap around) we don't mistakenly refer to new
 * processes.
 */


/*
 * struct upid is used to get the id of the struct pid, as it is
 * seen in particular namespace. Later the struct pid is found with
 * find_pid_ns() using the int nr and struct pid_namespace *ns.
 */
```

```c
struct upid {
	int nr;
	struct pid_namespace *ns;
};

struct pid
{
	refcount_t count;
	unsigned int level;
	spinlock_t lock;
	/* lists of tasks that use this pid */
	struct hlist_head tasks[PIDTYPE_MAX];
	struct hlist_head inodes;
	/* wait queue for pidfd notifications */
	wait_queue_head_t wait_pidfd;
	struct rcu_head rcu;
	struct upid numbers[];
};
```

## `struct task_struct` breakdown


### `struct thread_info` thread info

```c
struct task_struct {
#ifdef CONFIG_THREAD_INFO_IN_TASK
	/*
	 * For reasons of header soup (see current_thread_info()), this
	 * must be the first element of task_struct.
	 */
	struct thread_info		thread_info;
#endif
```

The kernel build option `CONFIG_THREAD_INFO_IN_TASK` determines whether the `struct thread_info` instance is embedded in `task_struct` or found in a hash table linked by a pointer (see `PID/PID hash table linkage` below).

`struct thread_info` is a CPU-specific structure defined in `arch/<archtecture>/`. For x86, it is:

```c
// arch/x86/include/asm/thread_info.h

struct thread_info {
	unsigned long		flags;		/* low level flags */
	unsigned long		syscall_work;	/* SYSCALL_WORK_ flags */
	u32			status;		/* thread synchronous flags */
#ifdef CONFIG_SMP
	u32			cpu;		/* current CPU */
#endif
};
```


### TODO



```c
	unsigned int			__state;

	/* saved state for "spinlock sleepers" */
	unsigned int			saved_state;

	/*
	 * This begins the randomizable portion of task_struct. Only
	 * scheduling-critical items should be added above here.
	 */
	randomized_struct_fields_start

	void				*stack;
	refcount_t			usage;
	/* Per task flags (PF_*), defined further below: */
	unsigned int			flags;
	unsigned int			ptrace;

#ifdef CONFIG_SMP
	int				on_cpu;
	struct __call_single_node	wake_entry;
	unsigned int			wakee_flips;
	unsigned long			wakee_flip_decay_ts;
	struct task_struct		*last_wakee;

	/*
	 * recent_used_cpu is initially set as the last CPU used by a task
	 * that wakes affine another task. Waker/wakee relationships can
	 * push tasks around a CPU where each wakeup moves to the next one.
	 * Tracking a recently used CPU allows a quick search for a recently
	 * used CPU that may be idle.
	 */
	int				recent_used_cpu;
	int				wake_cpu;
#endif
	int				on_rq;

	int				prio;
	int				static_prio;
	int				normal_prio;
	unsigned int			rt_priority;

	struct sched_entity		se;
	struct sched_rt_entity		rt;
	struct sched_dl_entity		dl;
	struct sched_dl_entity		*dl_server;
	const struct sched_class	*sched_class;

#ifdef CONFIG_SCHED_CORE
	struct rb_node			core_node;
	unsigned long			core_cookie;
	unsigned int			core_occupation;
#endif

#ifdef CONFIG_CGROUP_SCHED
