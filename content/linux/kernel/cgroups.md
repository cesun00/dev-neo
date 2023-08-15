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
