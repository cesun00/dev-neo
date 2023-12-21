---
title: "Zlib and DEFLATE: A Top-Down Introduction"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- zlib
- deflate
- compression
---

Zlib was authored by Jean-loup Gailly (compression) and Mark Adler (decompression).
- Jean-loup is also the primary author of the compression routines of gzip and Info-ZIP's Zip.
- Mark is also the author of the decompression routines of gzip and Info-ZIP's UnZip.

```sh
# ls -l /usr/lib/libz.*
-rw-r--r-- 1 root root 130742 Oct 25 08:55 /usr/lib/libz.a
lrwxrwxrwx 1 root root     11 Oct 25 08:55 /usr/lib/libz.so -> libz.so.1.3
lrwxrwxrwx 1 root root     11 Oct 25 08:55 /usr/lib/libz.so.1 -> libz.so.1.3
-rwxr-xr-x 1 root root 100296 Oct 25 08:55 /usr/lib/libz.so.1.3
```

Zlib does only one thing: it converts between raw data and DEFLATE-conforming compressed data, i.e. compressing and decompressing,
by providing the `deflate()` and `inflate()` functions.

To invoke either, one must set up a `z_stream` instance which serves as a context object to be passed to these functions.
This design allows `deflate()` and `inflate()` code to be flexible and thread-safe.

```c
typedef struct z_stream_s {
    // input buffer specification
    z_const Bytef *next_in;     /* next input byte */
