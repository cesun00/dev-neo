---
title: "GCC MISC"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - Linux
    - GCC
    - C
    - C++
---

### `cc1` and `cc1plus`

The output of `gcc -v` actually shows no invocation of the `cpp` preprocessor. Instead, `cc1`/`cc1plus` is invoked for both pre-processing and compilation of C/C++. My assumption is that those 2 programs fork-exec `cpp`.


GCC Developer Options
------------
- `-print-search-dirs`
- `-print-sysroot`
- `-print-prog-name`

    ```bash
    gcc -print-prog-name=cc1
    /usr/lib/gcc/x86_64-pc-linux-gnu/10.2.0/cc1
    ```

Specs String
----------------

The `gcc` executable is a driver program, invoking other executables, e.g. `cc1`, `as` and `collect2` (a wrapper around `ld`) to do the real job.

There needs to be a reasonable way for system admin to configure:

1. What program to invoke for what type of source file. E.g. `cc1` for `.c`-suffixed files, and `cc1plus` for `.cpp`-suffixed (or `.cc`-suffixed, etc.) ones.
2. What command line flags should be passed to each of the programs. E.g. `-I` should be passed to the preprocessor, but optimization flags like `-O2` should be passed to the compiler. (`gcc` don't actively modify environment variables to pass information to child processes.)

A "spec string" is a string template, which upon rendering becomes the literal command line flags that will be passed to a specific program.

A "spec file" is just a collection of k-v pairs, formatted in plain text, mapping a name to a spec string.

GCC hardcodes a built-in collection of spec strings (equivalently a default spec file). Buliding gcc with flag `--with-specs=<spec string>` allows adding to that built-in ones. (TODO: how? why no spec name? which spec string does it add to?)

The built-in spec strings can be dumped by `gcc -dumpspecs`.

The main scenario for admin to configure the spec strings is at run time. The CLI flag `-specs=<path_to_spec_file>` allows overriding the default spec strings upon each invocation of `gcc`.

## Makefile Support

The dependencies established by `#include` needs to be explicitly written in Makefile, so that when the included header file changes, `make` knows that including `.c` file needs be recompiled.

One way to do this is just put all header files as the prerequisites of each `.o` target, potentially coarsely pruned by the `configure` script. This is what nginx does:

```makefile
CORE_DEPS = src/core/nginx.h \
	src/core/ngx_config.h \
	src/core/ngx_core.h \
	src/core/ngx_log.h \
	src/core/ngx_palloc.h \
	src/core/ngx_array.h \
    # omitting...

objs/src/core/nginx.o:	$(CORE_DEPS) \
	src/core/nginx.c
	$(CC) -c $(CFLAGS) $(CORE_INCS) \
		-o objs/src/core/nginx.o \
		src/core/nginx.c
```

Another way to do this is to let GCC generate that info.


Suppose the line `#include "foo.h"` is in `main.c`: TODO

```makefile
all:main.o
	gcc main.o

# note that `foo.h` must be a dependency of `main.o`,
# otherwise changes in `foo.h` won't lead to re-compilation of `main.o`
main.o:main.c foo.h
	gcc -c main.c

clean:
	rm *.o a.out
```

Gcc can generate such Makefile source. See its `-MD` and `-MMD` options.

https://stackoverflow.com/a/15725861/8311608


