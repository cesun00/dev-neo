---
title: "Analytical Commentary: Nginx Source Guide"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## Environment Setup

### Build from source with debug flags

```bash
hg clone https://hg.nginx.org/nginx
# a linux build can be done without os/win32
rm -rf nginx/src/os/win32
mkdir install
cd nginx
./auto/configure --with-debug --prefix="$(realpath ../install)" --with-cc-opt='-ggdb3 -O0'
make -j8
make install
```

Note: By default nginx does out-of-source build in a directory called `objs/`. Call `configure` with `--builddir=` flag to change it. **Do not name your custom build directory `build`, it shadows the `build` goal in the main `Makefile`.** (yes, nginx folks don't use `.PHONY`)

`--with-debug` will define the `NGX_DEBUG` macro to 1, enabling logging functions for debug in `core/ngx_log.h`.

`-ggdb3` flag is real: search for `-ggdblevel` in `man gcc`. The `configure` script will generate a `objs/Makefile` that use `-g` by default. `-ggdb3` will be appended to the end of the `CFLAGS` variable, thus override the insufficient `-g`:

Nginx by default enable `-O`. We override it with `-O0`. `man gcc` recommends using `-Og` over `-O0` for debugging, BUT `-Og` still optimizes out too much variables for me, and some return statements are eliminated, so you can't breakpoint on them, so no.

![foo](plen.png)

(Important flag variable `plen` is optimized out under `-Og`.)

