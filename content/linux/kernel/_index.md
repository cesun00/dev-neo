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
│   ├── entry
│   ├── events
│   ├── futex
│   ├── gcov
│   ├── irq
│   ├── kcsan
│   ├── livepatch
│   ├── locking         # kernel locking infrastructures
│   ├── module
│   ├── power
│   ├── printk
│   ├── rcu
│   ├── sched
│   ├── time
│   └── trace           # ptracer
├── lib             # library source copies, some are customized from the original
├── LICENSES
├── mm              # memory management
│   ├── damon
│   ├── kasan
│   ├── kfence
│   └── kmsan
├── net             # network submodules
├── rust            
│   ├── alloc
│   ├── bindings
│   ├── kernel
│   ├── macros
│   └── uapi
├── samples         # demo mini programs on how to use kernel features, one executable per .c file
├── scripts             # build system shell / python scripts
├── security
├── sound               # sound subsystem
├── tools               # tool external programs. These code won't get into the kernel.
├── usr             # userspace code, primarily 
│   ├── dummy-include
│   └── include
└── virt            # virtualization supporting code, i.e. the kvm.
