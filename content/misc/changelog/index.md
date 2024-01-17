---
title: "Changelog"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

01.16
===========

### vscode not support virtual space from 2016 to 2024

https://github.com/microsoft/vscode/issues/13960

### build full static executable with `libtools`

Was about to build a statically linked [file](https://github.com/file/file) program.

First, the `--disable-shared --enable-static` options of `configure` script are shipped by the `LT_INIT` (https://www.gnu.org/software/libtool/manual/html_node/LT_005fINIT.html) macro. These flags control whether library codes in this project, if any, are built as shared objects or static library, instead of controlling the linking process of an executable. So obviously they won't work.

The following didn't work either:

```sh
../configure LDFLAGS=-static 
```

The built binary still has a few dynamic libraries linked:   

```sh
# ldd file
linux-vdso.so.1 (0x00007ffd381df000)
libm.so.6 => /usr/lib/libm.so.6 (0x00007fd259e1d000)
libz.so.1 => /usr/lib/libz.so.1 (0x00007fd259e03000)
libc.so.6 => /usr/lib/libc.so.6 (0x00007fd259c21000)
/lib64/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007fd259f59000)
```

Add `-d` option to `make` will print the detailed linking step:

