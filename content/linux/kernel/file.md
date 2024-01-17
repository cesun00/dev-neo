---
title: "Files"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## File descriptor & File Description

A file description is an instance of `struct file` (in `<linux/fs.h>`). Every call to `open(2)` creates a new instance, and put it into a system-wide open file table. File descriptions are system-wide, and solely managed by the kernel.

https://github.com/torvalds/linux/blob/master/include/linux/fs.h

```c
struct file {
	union {
		struct llist_node	fu_llist;
		struct rcu_head 	fu_rcuhead;
	} f_u;
	struct path		f_path;
	struct inode		*f_inode;	/* cached value */
	const struct file_operations	*f_op;

	/*
	 * Protects f_ep, f_flags.
	 * Must not be taken from IRQ context.
	 */
	spinlock_t		f_lock;
	enum rw_hint		f_write_hint;
	atomic_long_t		f_count;
	unsigned int 		f_flags;
	fmode_t			f_mode;
