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

