---
title: "Memo: diff(1) and patch(1) utilities"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The `diff` program is useful for comparing the difference of 2 files and generating a strictly formatted
text report of the difference. Comparing 2 directories, defined by recursively comparing corresponding files with the same path,
is supported. This is extremely useful for managing and releasing new versions of software in an incremental way
before the widespread of source version control software like `git`.
For example, [early versions of glibc (1.01 to 1.09) were released as incremental patches from v1.00](https://ftp.gnu.org/old-gnu/glibc/),
instead of making a complete source tarball for each version.

[A `diff` command first appeared in Version 5 AT&T UNIX (Jun 1974).](https://man.openbsd.org/diff)
A `unidiff` program was written by Wayne Davison (davison@dri.com) and posted on [`comp.sources.misc` Volume 14](http://www.nic.funet.fi/pub/misc/archive/comp.sources.misc/volume14/unidiff/) in 1990, which used a more compact output format. Wayne claimed a reduced diff output size by 25%.

Support for the unidiff format was added to GNU diff 1.15 in January 1991 by Richard Stallman.

A conforming `diff` is now required by IEEE Std 1003.1-2008 (POSIX.1) which must support both formats.
A popular implementation in the Linux world is the [GNU diffutils](https://www.gnu.org/software/diffutils/).
Apart from a POSIX conforming `diff`, this package also provides a `cmp` program that compares 2 files byte-by-byte
a `diff3` that `diff` 3 files, and a `sdiff` that merges 2 files interactively.

This article will only discuss POSIX behavior, and won't distinguish between implementations, unless otherwise noted.

## Output Format

`diff` has 2 formats of output:

{{<columns>}}

### context format

This is the format used by the original UNIX `diff`.

```diff
# diff -c <(echo -e 'foo\nbar') <(echo -e 'foo\nzoo')
*** /dev/fd/63	2024-03-30 22:29:07.600618249 +0800
--- /dev/fd/62	2024-03-30 22:29:07.600618249 +0800
***************
*** 1,2 ****
  foo
! bar
--- 1,2 ----
  foo
! zoo
```

<--->

### unified format

This is the format used by the Wayne's `unidiff`.

```diff
# diff -u <(echo -e 'foo\nbar') <(echo -e 'foo\nzoo')
--- /dev/fd/63	2024-03-30 22:29:11.437284751 +0800
+++ /dev/fd/62	2024-03-30 22:29:11.437284751 +0800
@@ -1,2 +1,2 @@
 foo
-bar
+zoo
```

{{</columns>}}

The unified format prevails nowadays since it's more compact, and the context format is deprecated.

The report of the directory-wise comparison usually has a `.diff` extension if generated with `-c` flag,
or a `.udiff` extension if with `-u` flag

By convention, a diff file computed by `diff -ruN` on each file has 
and a `diff -rcN` one has 

## Making patches

A standard patch file is made by:

```sh
cd COMMON_PARENT_DIR
diff -ruN OLD_VER_DIR NEW_VER_DIR >patch.diff
```

Again let's take glibc as an example.

## Applying patches

To upgrade a source tree, apply the patch file by:

```sh
cd OLD_VER_DIR
patch -p1 <patch.diff
```

## See also

Mcllroy (the leader boss of K&R) 

https://www.cs.dartmouth.edu/~doug/reader.pdf