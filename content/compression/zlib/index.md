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
    uInt     avail_in;          /* number of bytes available at next_in */
    uLong    total_in;          /* total number of input bytes read so far */

    // output buffer specification
    Bytef    *next_out;         /* next output byte will go here */
    uInt     avail_out;         /* remaining free space at next_out */
    uLong    total_out;         /* total number of bytes output so far */

    // state control
    z_const char *msg;                  /* last error message, NULL if no error */
    struct internal_state FAR *state;   /* not visible by applications */

    // memory control
    alloc_func zalloc;  /* used to allocate the internal state */
    free_func  zfree;   /* used to free the internal state */
    voidpf     opaque;  /* private data object passed to zalloc and zfree */

    int     data_type;  /* best guess about the data type: binary or text
                           for deflate, or the decoding state for inflate */
    uLong   adler;      /* Adler-32 or CRC-32 value of the uncompressed data */
    uLong   reserved;   /* reserved for future use */
} z_stream;
```

## compressing

```c
int deflate(z_stream *strm, int flush);
```

Each call to `deflate()` either
1. compresses as much data as possible and returns when the input buffer becomes empty or the output buffer becomes full.
2. reports that no progress of compression can be made due to the end of input or insufficient space in the output buffer
