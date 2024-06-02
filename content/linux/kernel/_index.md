---
title: "The Linux Kernel"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

General feature discussion and source analysis about the Linux kernel we all like.

<!--more-->

Kernel sources are arranged in modules. Each module culminates in a `built-in.a`.

```tree
.
├── arch            # architecture specific code
├── block               # block device related code
│   └── partitions      # partition scheme (e.g. mbr, uefi) specific code
├── certs
├── crypto
├── Documentation       # doc
├── drivers             # driver modules each implements a `struct file_operations`
├── fs              # filesystem-specific code
├── include                 # architecture-independent headers
├── init                # initramfs implementation
├── io_uring
├── ipc                 # inter-process communiciation: POSIX MQ mq_overview(7), POSIX semaphore sem_overview(7) , POSIX shared memory shm_overview(7)
├── kernel              # kernel feature implementation: syscall & subsystems
│   ├── bpf                 # the script interpreter in ring 0
│   ├── cgroup              # control group
│   ├── configs
│   ├── debug
│   ├── dma
