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

