---
title: "The `ld` Linker Script"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

On some Linux distro the famous `/usr/lib/libc.so` is a plain text file:

```ldscript
/* GNU ld script
   Use the shared library, but some functions are only in
   the static library, so try that secondarily.  */
OUTPUT_FORMAT(elf64-x86-64)
GROUP ( /usr/lib/libc.so.6 /usr/lib/libc_nonshared.a  AS_NEEDED ( /usr/lib/ld-linux-x86-64.so.2 ) )
```