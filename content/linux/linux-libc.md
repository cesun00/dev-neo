---
title: "Retrospection: The Linux Libc"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
ref:
    - https://web.archive.org/web/20040411191201/http://people.redhat.com/~sopwith/old/glibc-vs-libc5.html
    - https://www.maketecheasier.com/history-of-early-linux-distros/
    - https://lwn.net/Articles/417647/
---

POSIX.1 was defined by the `IEEE Std 1003.1-1988` specification released in 1988.
The Linux kernel was written in 1991.
The GNU project was already famous at that time: GCC was first released in March 1987, and 

The kernel team needed a userspace C runtime as wrapper for system calls as well as providing various non-kernel utilities.
GNU's glibc 0.1 was released already.

[Many claim that the Linux libc was a fork of from glibc v1.09](https://web.archive.org/web/20040411191201/http://people.redhat.com/~sopwith/old/glibc-vs-libc5.html):
1. 

There is a widespread is that [it ], I believe that it occur v0.01


This fork at least date back to 1991. Directory were restructured, most file were rewritten.

<!-- at some point before glibc 1.09. (glibc 1.09 was released in) -->


<!-- Older versions of libc were apparently shipped tightly coupled with gcc, under the names “jump4?.tar” – if you have one of these tarballs lying around on an old SLS, Slackware, MCC, TAMU, or root/boot set, I’d love to have a copy of it. -->

libc was created by Linux developers who felt that glibc development at the time was not sufficing for the needs of Linux.
1. the directory structure was rearranged.
2. Linus reimplements some critical function in pure x86 assembly for maximized performance
3. Linux libc kept plucking good implementation from glibc continuously during 1992 to 1996.

This fork lived from 1994 to 1998.

The source of this libc5 are now at https://mirrors.edge.kernel.org/pub/linux/libs/libc5/

`libc.so.5.4.46` ELF binary

libc 4 & 5 had been hacked together from a very very very old glibc , I believe).

`sunsite.unc` now becomes https://www.ibiblio.org/

These series, libc's 1-4, were the C libraries for programs stored in the a.out binary format.

libc 5 heralded the move to storing programs in the ELF (Executable and Linking Format) binary format, which provided much greater flexibility and the ability to easily make libraries of routines that could be shared between running programs. While a.out had this ability, ELF made it easy, and brought Linux up to speed with other modern UNIX-like OS's (such as Sun Solaris, Digital UNIX, and IRIX) that use the same format.

The last release of libc5 is version 5.4.46 (1998-06-21). You can find it 
https://launchpad.net/ubuntu/hoary/i386/libc5/5.4.46-15. 

H.J LU He is believed to be an Asian American.
https://marc.merlins.org/linux/lwce_summer99/Day3/Conferences/Knfs.html
hj LU ceased the maintainance of libc5 in Jul 1998.


An interview with hj hu : https://linuxgazette.net/issue32/tag_libc5.html