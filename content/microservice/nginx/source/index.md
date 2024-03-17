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

```bash
$ head objs/Makefile  | grep CFLAGS
CFLAGS =  -pipe  -O -W -Wall -Wpointer-arith -Wno-unused-parameter -Werror -g -ggdb3 -O0
```

### Test compiled executable

```bash
cd nginx_install
# change conf/nginx.conf to use non-privileged port.
./sbin/nginx
curl localhost:8000
./sbin/nginx -s quit
```


### Config for Debug

By default the `nginx` executable after invoked, will (exec or fork-exec?) the master process, which read the conf file and spawn the worker processes. 2 conf directives affect this behavior:

1. `daemon on|off;` (default: `on`)
    
    Set to `off` to prevent the `nginx` executable from detaching from the terminal. This allows the shell to forward all keyboard event signals (e.g. `Ctrl-C` for `SIGINT`) directly to the master (and workers?) process. There will still be master and worker processes, all connected to the same terminal.

2. `master_process on|off;` (default: `on`)

    Set to `off` to prevent the `nginx` executable process from spawning the master process **and** worker processes. It will be the only process of nginx, handling everything.

By default all nginx processes prints nothing to `stdout` or `stderr`. `error_log` can be printed to `stderr` by using the `error_log stderr;` conf directive or the `-e stderr` CLI flag. There is no way for HTTP `access_log` to be printed to `stdout` or `stderr`.

Special Headers
--------------
