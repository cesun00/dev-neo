---
title: "GNU glibc"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

https://sourceware.org/glibc/wiki/Glibc%20Timeline

The GNU Project was publicly announced on September 27, 1983. <!-- on the net.unix-wizards and net.usoft newsgroups by Stallman -->
The development of glibc started around 1987. The very first few contributions (not "commit" though - git was not a thing :) )
were made by [Roland McGrath](https://lwn.net/Articles/634495/).
By 1988, [a GNU Bulletin reported that "Most libraries are done"](https://www.gnu.org/bulletins/bull4.html).
[A module called `UFC-crypt` was published on `alt.sources` on Sep 24 1991](http://ftp.fi.netbsd.org/pub/misc/archive/alt.sources/volume91/Sep/910925.07.gz), and later incorporated into glibc to provide a fast implementation of UNIX `crypt(3)` API.
A few improvement was accomplished, and GLIBC 1.00 was released on 1992-02-18.
Unfortunately, this version is now a lost media.

The earliest version you can easily find on the Internet is [glibc v1.09.1, released on 1996-05-27](https://ftp.gnu.org/gnu/glibc/).
But 1.09.1 is really only 1 line of change away from 1.09 (1994-11-07), which banned implementing `__NORETURN` and `__CONSTVALUE` macros as GCC attributes `__attribute__ ((__volatile__))` and `__attribute__ ((__const__))` for all circumstances:

```diff
diff -ruN glibc-1.09/misc/sys/cdefs.h glibc-1.09.1/misc/sys/cdefs.h
--- glibc-1.09/misc/sys/cdefs.h	Mon Oct 24 14:16:11 1994
+++ glibc-1.09.1/misc/sys/cdefs.h	Mon May 27 13:07:32 1996
@@ -35,7 +35,7 @@
 #if	__GNUC__ < 2 || (__GNUC__ == 2 && __GNUC_MINOR__ < 5)
 #define	__NORETURN	__volatile
 #define	__CONSTVALUE	__const
- #elif	__GNUC__ > 2 || __GNUC_MINOR__ >= 7 /* Faith.  */
+ #elif 0 /* XXX */
 /* In GCC 2.5 and later, these keywords are meaningless when applied to
    functions, as ANSI requires.  Instead, we use GCC's special
    `__attribute__' syntax.  */
```

Early patches like this can be found at https://ftp.gnu.org/old-gnu/glibc/, which allows you to `patch -R` back to v1.06, but not further.

Glibc 1.09 is an important release. The *Linux Libc* was forked from this version.

If you are willing to ignore the trivial 1.09.1 patch, the develo
The development of glibc was then paused for about 2 years, though a trivial patch v1.09.1 (1996-05-27) existed with only 1 line of change.

to remove the usage of GCC attributes `__attribute__ ((__volatile__))` and `__attribute__ ((__const__))`.

Ulrich wrote in the `ChangeLog`:

```
Sun Jan 26 13:39:31 1997  Ulrich Drepper  <drepper@cygnus.com>

	* Version 2.0 net release.
```

The ftp hosts only complete tree of v2.0.1. You need to do the unpatching trick again.
