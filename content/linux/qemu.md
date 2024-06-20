---
title: "QEMU (Quick Emulator)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## administrative

qemu-img
qemu-keymap
qemu-storage-daemon
qemu-pr-helper      Persistent Reservation helper program for QEMU
qemu-nbd        QEMU Disk Network Block Device Utility
qemu-io         QEMU Disk exerciser
qemu-edid           This is a test tool for the qemu edid generator.

## Linux CPU emulator (compiled for * emulation)

qemu-aarch64
qemu-microblaze
qemu-m68k
qemu-riscv32
qemu-aarch64_be
qemu-microblazeel
qemu-riscv64
qemu-alpha
qemu-mips
qemu-s390x
qemu-arm
qemu-mips64
qemu-sh4
qemu-armeb
qemu-mips64el
qemu-sh4eb
qemu-cris
qemu-mipsel
qemu-sparc
qemu-mipsn32
qemu-sparc32plus
qemu-hexagon
qemu-mipsn32el
qemu-sparc64
qemu-hppa
qemu-i386
qemu-nios2
qemu-or1k
qemu-x86_64
qemu-ppc
qemu-xtensa
qemu-ppc64
qemu-xtensaeb
qemu-loongarch64
qemu-ppc64le

## qemu-system emulators

qemu-system-m68k
qemu-system-sh4
qemu-system-i386
qemu-system-rx
qemu-system-loongarch64
qemu-system-s390x
qemu-system-microblaze
qemu-system-sh4eb
qemu-system-microblazeel
qemu-system-sparc
qemu-system-mips
qemu-system-sparc64
qemu-system-mips64
qemu-system-tricore
qemu-system-mips64el
qemu-system-x86_64
qemu-system-mipsel
qemu-system-xtensa
qemu-system-aarch64
qemu-system-nios2
qemu-system-xtensaeb
qemu-system-alpha
qemu-system-or1k
qemu-system-arm
qemu-system-ppc
qemu-system-avr
qemu-system-ppc64
qemu-system-cris
qemu-system-riscv32
qemu-system-hppa
qemu-system-riscv64


## man pages


```ls
# ls qemu* -hl
-rw-r--r-- 1 root root  62K Mar 28 04:34 qemu.1.gz
-rw-r--r-- 1 root root  14K Mar 28 04:34 qemu-img.1.gz
-rw-r--r-- 1 root root 4.3K Mar 28 04:34 qemu-storage-daemon.1.gz
lrwxrwxrwx 1 root root    9 Mar 28 04:34 qemu-system-aarch64.1.gz -> qemu.1.gz
lrwxrwxrwx 1 root root    9 Mar 28 04:34 qemu-system-alpha.1.gz -> qemu.1.gz
lrwxrwxrwx 1 root root    9 Mar 28 04:34 qemu-system-arm.1.gz -> qemu.1.gz
# omitting qemu-system-*.1.gz
```

## system-* options

-cdrom file
    Use  file as CD-ROM image on the default bus of the emulated machine (which is IDE1 mas‐
    ter on x86, so you cannot use -hdc and -cdrom at the same time there). On  systems  that
    support it, you can use the host CD-ROM by using /dev/cdrom as filename.

-boot <specification>

    options to the boot process of this invocation

    `specification` being a comma separated list of `k=v` pairs:

    order=DRIVE

        DRIVE must be a sequence of characters.
        The x86 PC uses: a, b (floppy 1 and 2), 
                c (first hard disk),
                d (first CD-ROM),
                n-p (Etherboot from network adapter 1-4),

                c (hard disk) is assumed if `-boot order=` is not present, meaning that you need
                an explicit `-boot order=d` for installing an OS from an ISO.

-drive <specification>

    `specification` being a comma separated list of `k=v` pairs
    - file=<PATH>,format=<FMT>     Use the file specified by PATH as 

-m [size=]megs[,slots=n,maxmem=size]
    
    adjust the size of memory instead of the default 128MiB.


## disk management

For host FS that supports hole ...