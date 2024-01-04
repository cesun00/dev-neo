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
