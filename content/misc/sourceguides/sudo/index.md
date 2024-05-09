---
title: "Sudo"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---


## `include/sudo_queue.h`

This is a historical copy of [sys/queue.h from FreeBSD](https://github.com/freebsd/freebsd-src/blob/main/sys/sys/queue.h)
which contains macros used to define 4 types of data structures. See `queue(3bsd)` for an overview of this file.

| links per node \ headed by | head only                      | head and tail                         |
|----------------------------|--------------------------------|---------------------------------------|
| next only                  | `SLIST_*()` single linked list | `STAILQ_*()` single linked tail queue |
| next and prev              | `LIST_*()` double-linked list  | `TAILQ_()` double-linked tail queue   |

Modern Linux distros ship a slightly different version of this file at `/usr/include/sys/queue.h`, which
[forks from OpenBSD](https://github.com/openbsd/src/blob/master/sys/sys/queue.h).
`queue(7)` , `list(3)`, `slist(3)`, `stailq(3)`, `tailq(3)`, `circleq(3)`, and `insque(3)`
are manuals for OpenBSD/Linux version of this file, but may of some help.

## `lib/`

```
zlib/       # a minimal source-level copy of the zlib (TODO how this is extracted from zlib repo?)
```


### `lib/utils/*`

Contain implementations of utility functions
1. that are original or copy-and-paste from other projects, with `sudo_` prepended to function names; or
2. that are polyfills in case of a missing function.

    e.g. for a missing `getdelim(3)` usually found in glibc, `getdelim.c` provides its `sudo_getdelim()` implementation which
    is aliased to `getdelim`. No code should call `sudo_getdelim()` directly.

    ```c
    // include/sudo_compat.h
    # define getdelim(_a, _b, _c, _d) sudo_getdelim((_a), (_b), (_c), (_d))
    ```

Their declarations are exposed in `include/sudo_utils.h` and included by other code.


- `rcstr.c`: implements reference-counting strings that get free-ed when the counter reaches 0.
- 

## generated sources., lex, and yacc

- gram.h gram.c: generated from yacc source file `gram.y`

    Some tricks hide in the `Makefile.in` where `yacc` is invoked with `-p`, a deprecated equivalence of specifying `api.prefix` option.

    This is why you can't find definition of `sudoersparse()` in the source.

- getdate.c: generated from yacc source file `getdate.y`
- toke.c: generated from flex source file `toke.l`. Note however `toke.h` is hand written.
- def_data.c def_data.h: generated from `def_data.in`

For some strange reason, these generated files are shipped in a source release, and are even committed into the repo.
Unless a `DEVEL` make variable is set to a non-empty string, these file will not be generated again at host machine's `make` invocation.

## the shitty `plugins` design

The following executables are produced as defined by `Makefile.in`.
Unfortunately, source files of each binary are clogged in the same directory, instead of nicely having their own dirs.

visudo
cvtsudoers
sudoreplay
testsudoers
tsdump
check_addr
check_base64
check_digest
check_editor
check_env_pattern
check_exptilde
check_fill
check_gentime
check_iolog_plugin
check_serialize_list
check_starttime
check_unesc
check_symbols
fuzz_policy
fuzz_sudoers
fuzz_sudoers_ldif