---
title: "Virtual File Systems"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Historically, if a privileged program want to consult content of certain kernel data structure, the only way is to read and interpret `/dev/kmem` directly, which is obviously dangerous and error prone.

The now recommended approach is to read entries in the `proc` VFS conventionally mounted at `/proc`.
In deprecation of the legacy method, ince Linux 2.6.26, `/dev/kmem` file is available only if the kernel is compiled with `CONFIG_DEVKMEM`.

https://www.kernel.org/doc/html/latest/filesystems/vfs.html

## procfs

Linux expose certain task-related kernel structures via `write` and `read` syscalls,
instead of having a new syscalls. This leads to the design that most information is exposed as file descriptor interger, 
and can be read and write.

In order to obtain integer fd, a file path must be used for `open` syscalls, this leads to the apparence of a filesystem that list these pathes.

## sysfs

> sysfs has strict one-value-per-file rules.

- Some VFS are *singleton*, meaning that upon mount you always get the same instance of that file system, thus the same collection of files. Examples are cgroupv2 and sysfs.
- Others, like tmpfs, will have different instance for each mount.