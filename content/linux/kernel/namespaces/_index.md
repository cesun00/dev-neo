---
title: "Linux Namespaces"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

A task 

- when `clone()` or 

A namespace instance is a group of tasks, such that tasks in the same namespace instance share the same view on a type of resources.

Since kernel version 5.6, there are 8 namespace types:

|         |                       |                                      |
|---------|-----------------------|--------------------------------------|
| Cgroup  | cgroup_namespaces(7)  | Cgroup root directory                |
| IPC     | ipc_namespaces(7)     | System V IPC, POSIX message queues   |
| Network | network_namespaces(7) | Network devices, stacks, ports, etc. |
| Mount   | mount_namespaces(7)   | Mount points                         |
| PID     | pid_namespaces(7)     | Process IDs                          |
| Time    | time_namespaces(7)    | Boot and monotonic clocks            |
| User    | user_namespaces(7)    | User and group IDs                   |
| UTS     | uts_namespaces(7)     | Hostname and NIS domain name         |


A Linux system starts with a single namespace instance of each type.
Each namespace instance (regardless of the type) is identified unique 32-bit unsigned integer ID.

For each namespace type, a `task_struct` instance is associated with an instance of that type,
and can only see or use the resources associated with that namespace.

e.g. A task associated 

`util-linux` package provides a `lsns` command that lists all namespace instances of all types (by reading the `/proc` fs):

As shown, there is 
- a single `time` namespace instance
- a single `cgroup` namespace instance
- a single `uts` namespace instance 
- a single `ipc` namespace instance
- a single `mnt` namespace instance
- 3 `user` namespace instances
- 54 `pid` namespace instances

```sh
```

## Create a new namespace instance

A new namespace instance of a given type must be created by `clone`-ing a new task as the first process in that namespace.
This has to be done via the `clone / __clone2 / clone3` syscalls with the following bits set in the `flag` bit field:
- `CLONE_NEWCGROUP`: 
- `CLONE_NEWIPC`: 
- `CLONE_NEWNET`: 
- `CLONE_NEWNS`: 
- `CLONE_NEWPID`: 
- `CLONE_NEWTIME`: 
- `CLONE_NEWUSER`: 
- `CLONE_NEWUTS`: 