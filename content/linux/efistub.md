---
title: "Boot Linux kernel without GRUB (or other bootloader)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The EFISTUB feature of the Linux kernel allows a kernel to be invoked directly as an EFI application, thus eliminate the necessity of using a bootloader.

First, check that your kernel has EFISTUB enabled:

```sh
zgrep 'CONFIG_EFI_STUB' /proc/config.gz
```

```sh
efibootmgr --create
    --disk ... # device node e.g. /dev/sdX
    --part ... # partition number
    --label ... # Entry Nickname
    --loader '/vmlinuz-linux'    # the executable path under the given partition
    --unicode       # interpret the following string in UCS-2 as argument to the EFI application, in our case, the kernel
    'root=UUID=01a40dd8-28f0-4636-be1e-aeed60c98095 resume=UUID=2d877d5d-4ca1-4d46-a3d6-b6ee94cbbd78 rw rootflags=subvol=@ loglevel=3 quiet initrd=\initramfs-linux-lts.img'        # kernel arguments
```
