---
title: "Kernel Locking"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- Linux
- kernel
---

## spin locks

A spinlock is represented by a `struct spinlock` a.k.a `spinlock_t` defined in `include/linux/spinlock_types.h`, with all its APIs declared in `include/linux/spinlock.h`.

```c
// include/linux/spinlock_types.h

#ifndef CONFIG_PREEMPT_RT

/* Non PREEMPT_RT kernels map spinlock to raw_spinlock */
typedef struct spinlock {
	union {
		struct raw_spinlock rlock;

// #ifdef CONFIG_DEBUG_LOCK_ALLOC
// # define LOCK_PADSIZE (offsetof(struct raw_spinlock, dep_map))
// 		struct {
// 			u8 __padding[LOCK_PADSIZE];
// 			struct lockdep_map dep_map;
// 		};
// #endif
	};
} spinlock_t;

#define ___SPIN_LOCK_INITIALIZER(lockname)	\
	{					\
	.raw_lock = __ARCH_SPIN_LOCK_UNLOCKED,	\
	SPIN_DEBUG_INIT(lockname)		\
	SPIN_DEP_MAP_INIT(lockname) }

#define __SPIN_LOCK_INITIALIZER(lockname) \
	{ { .rlock = ___SPIN_LOCK_INITIALIZER(lockname) } }

#define __SPIN_LOCK_UNLOCKED(lockname) \
	(spinlock_t) __SPIN_LOCK_INITIALIZER(lockname)

#define DEFINE_SPINLOCK(x)	spinlock_t x = __SPIN_LOCK_UNLOCKED(x)

#else /* !CONFIG_PREEMPT_RT */

// omitted, see below

#endif /* CONFIG_PREEMPT_RT */
```

To initialize

### spinlock internals

`struct spinlock` maps to a `raw_spinlock` when `CONFIG_PREEMPT_RT` is off, which is also the general common case.
`CONFIG_PREEMPT_RT` depends on `ARCH_SUPPORTS_RT` which is only available when the kernel is patched with [the PREEMPT_RT patch](https://wiki.linuxfoundation.org/realtime/start), and compiling for hardware that supports real-time preemption (ARM64 does, while x86 and x86-64 don't).

`struct raw_spinlock` is an `arch_spinlock_t` with some debugging facilities;
`arch_spinlock_t` is an
1. architecture-dependent spinlock implementation if `CONFIG_SMP` is on, i.e. compiling for an SMP system; or
2. `struct lockdep_map` if `CONFIG_SMP` is off, i.e. compiling for an uniprocessor system.

```c
// include/linux/spinlock_types_raw.h

typedef struct raw_spinlock {
	arch_spinlock_t raw_lock;
// #ifdef CONFIG_DEBUG_SPINLOCK
// 	unsigned int magic, owner_cpu;
// 	void *owner;
// #endif
// #ifdef CONFIG_DEBUG_LOCK_ALLOC
// 	struct lockdep_map dep_map;
// #endif
} raw_spinlock_t;
```

For x86, `arch_spinlock_t` uses the default `asm-generic` implementation:

```c
// include/asm-generic/qspinlock_types.h

typedef struct qspinlock {
	union {
		atomic_t val;

		/*
		 * By using the whole 2nd least significant byte for the
		 * pending bit, we can allow better optimization of the lock
		 * acquisition for the pending bit holder.
		 */
#ifdef __LITTLE_ENDIAN
		struct {
			u8	locked;
			u8	pending;
		};
		struct {
			u16	locked_pending;
			u16	tail;
		};
#else
		struct {
			u16	tail;
			u16	locked_pending;
		};
