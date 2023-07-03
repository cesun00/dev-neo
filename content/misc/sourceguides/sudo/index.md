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


