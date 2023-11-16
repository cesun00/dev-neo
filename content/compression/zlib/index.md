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

1. Part of the input buffer will always be consumed, signaled by the `next_in` and `avail_in` being updated accordingly.
2. The output buffer may or may not receive compressed bytes, depending on the `flush` flag.

| flush               | after deflate return ... |
|---------------------|--------------------------|
| Z_NO_FLUSH      (0) |                          |
| Z_PARTIAL_FLUSH (1) |                          |
| Z_SYNC_FLUSH    (2) |                          |
| Z_FULL_FLUSH    (3) |                          |
| Z_FINISH        (4) |                          |

An ideal `deflate()` invocation returns `Z_OK` with non-zero `avail_out`. 

Returns:
1. `Z_OK`: some progress has been made.
    1. with `avail_out == 0`:
2. `Z_BUF_ERROR`: no progress is possible due to the end of input or insufficient space in the output buffer. This is not a fatal error, and `deflate()` can be called again once more input or more space in output buffer is available.
3. `Z_STREAM_END`: all input has been consumed and all output has been written; only possible when `flush == Z_FINISH`.
4. `Z_STREAM_ERROR`: fatal error; stream state is broken by external code.

```c
z_stream ctx;
// 1.zalloc, zfree, and opaque must be setup before deflateInit()
ctx.zalloc = Z_NULL;
ctx.zfree = Z_NULL;
ctx.opaque = Z_NULL;

// 2. initialize computation
if (deflateInit(&ctx, Z_DEFAULT_COMPRESSION) != Z_OK) {
    fprintf(stderr, "Error initializing zlib\n");
    exit();
}

// 3. point to the beginning of input
ctx.next_in = msg;
ctx.avail_in = strlen(msg);

// 3. compression loop: while more input available
while (ctx.total_in < strlen(msg)) {
    // 1. ensure in output buffer by adjusting next_out and avail_out

    // 2. optionally set parameters
    deflateParams()

    // 3. call deflate() with desired flush style, e.g. Z_NO_FLUSH
    deflate(&ctx, Z_NO_FLUSH);
}

while ()

deflateEnd(&ctx) // free resources
```


## decompressing

```
populate a `z_stream` instance
inflateInit (macro to deflateEnd_() call)
while (input available) {
    # inflate has no param to configure
    inflate() call          
}
inflateEnd()
```

## convenient utilities

## misc

APIs:

```
compress() and uncompress()


gzerror

gzgetc gzungetc
gzgets gzputc
gzopen  gzclose

gzprintf
gzread  gzputs
gzseek gztell
```