---
title: "Linux Control Group (cgroup)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The cgroup is a feature of the Linux kernel that allows the grouping of processes such that
restrictions on resources like
- available memory
- CPU cores 
- network bandwidth 
- maximum count of threads / processes 
- filesystem quota

can be imposed by an administrator in terms of that group.

## Model

A cgroup is a set of arbitrary `struct task`. Tasks in a cgroup do not need to be contiguous on the process tree.
A `clone(2)` creates a child task in the same cgroup, unless
<!-- 1. for `clone()`, `CLONE_NEWCGROUP` flag, or -->
2. for `clone3()`, `CLONE_INTO_CGROUP` and `clone_args.cgroup` is

used. Linux uses glibc which implements `fork` with clone, so the discussion applies.

A process can be moved to a different cgroup without affecting the cgroup-belonging of its children.

Cgroups divide all processes on the system into disjoint sets, i.e. each process must and only belongs to a single cgroup. 
There are empty cgroup with no processes, serving only organization purposes.
To see which cgroup a certain pid belongs to, read `/proc/<pid>/cgroup` or use `ps -o pid,cgroup`.

Cgroups are hierarchical, meaning that
1. a cgroup has a parent cgroup, and there is a root cgroup;
2. a cgroup can have children cgroups.

The cgroup hierarchy facilitates hierarchical behavior of controllers: the limits placed on a cgroup at a higher level in the hierarchy cannot be exceeded by descendant cgroups.

Again the cgroups hierarchy has nothing to do with the process tree hierarchy, i.e. the cgroup-belonging of processes is arbitrary, except that by default a child process is in the same cgroup as its parent, as mentioned above.

The cgroup hierarchy is reflected by the `cgroup2` VFS, discussed below. 

## glossary & misc

- The first cgroup implementation (now known as `cgroup-v1`) was merged into the Linux kernel mainline in kernel version 2.6.24 (released in January 2008). 
- A complete rework, known as `cgroup-v2`, was done around 2016 and first appeared in Linux kernel 4.5 (released on 14 March 2016), with significant changes to the interface and internal functionality.
- The most important difference compared to `cgroup-v1` is that cgroup-v2 has only a single process hierarchy and discriminates between processes, not threads. It's possible, though deprecated, that v1 and v2 cgroup subsystem is enabled on the same Linux installation. This article will not discuss cgroup v1.

- Whe discussing cgroup, *process* and *task* are differentiated:
	- process:
	- task:
- resource controller: a piece of code that enforces the resource limitation on a cgroup.

## `cgroup2` VFS

To access cgroups information, Linux exposes a `cgroup2` pseudo filesystem like always (e.g. procfs and sysfs).
A default instance is mount at `/sys/fs/cgroup`:

```sh
# mount | grep cgroup
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
```

You can mount the same FS instance at your arbitrary mounting point by calling `mount(2)` with:

```c
mount("dummy", "path/to/mounting/point", "cgroup2", flags)
```

or use the equivalent `mount(8)` command.

```sh
mount -t cgroup2 dummy ${MOUNT_POINT}
```

Each mount of `cgroup2` always rebinds the same one.

*There is no syscalls designed specifically for cgroups.*
The cgroup2 VFS is meant to be the *only* interface to users.

The `${MOUNT_POINT}` directory will represent the nameless root cgroup, i.e. the one initially all processes are in.

Recursively:
- File entries with name `cgroup.*` describes attributes of the cgroup represented by pwd.
- File entries with name `<controller>.*` describes controller-specific attributes for controllers effective at this cgroup.
- Directories entries represent direct child cgroups.

File / Filesystem operation on this VFS changes the cgroup configuration of the running system, namely
1. `mkdir` creates a new children cgroup of the cgroup represented by `pwd`; the kernel will populate default files after a new cgroup has been `mkdir`-ed.
2. reading from / writing to various files reads / changes the configuration of a cgroup.

Only leaf cgroups and the root cgroup can contain processes; all other cgroups are organization nodes, with no process in it (i.e. empty `cgroup.procs` file)

### VFS entries

1. `cgroup.*` files represent cgroup metadata
2. `<controller>.*` files represents controller-specific informations
	- `cpu.*`
	- `memory.*`
3. subdirectories represents children cgroups

- `cgroup.controllers`: a read-only file that lists all controllers that *may* be enabled for this cgroup.
No controllers listed in this file are enabled by default. Controllers can be enabled and disabled by writing to the `cgroup.subtree_control` file.
- `cgroup.subtree_control`:
	- reading this file prints enabled controller, one per line
	- writing to this file must be in the format of `+controller` or `-controller`; e.g. `echo "+cpu +memory -io" > cgroup.subtree_control`;
- `cgroup.procs`
	- `read`: unorderly lists pids in this cgroup. Some cgroup exists only for organization purposes and has no process itself (e.g. `system.slice`)
	- `write`: migrate process `pid` to this cgroup. 
		- 1 process per `write` call.
		- No `O_APPEND` is required for `open`.
		- For multi-thread process, migrating any thread migrates all other threads.



## Internals

[`task_struct`](https://github.com/torvalds/linux/blob/ef8e4d3c2ab1f47f63b6c7e578266b7e5cc9cd1b/include/linux/sched.h#L728) holds a reference-counted pointer to `struct css_set`:

```c
struct task_struct {
    // ...

#ifdef CONFIG_CGROUPS
	/* Control Group info protected by css_set_lock: */
	struct css_set __rcu		*cgroups;
	/* cg_list protected by css_set_lock and tsk->alloc_lock: */
	struct list_head		cg_list;
#endif
}
```

`struct css_set` defined in [linux/cgroup-defs.h](https://github.com/torvalds/linux/blob/6f38be8f2ccd9babf04b9b23539108542a59fcb8/include/linux/cgroup-defs.h#L199) is a set of `struct cgroup_subsys_state`, thus the name:
