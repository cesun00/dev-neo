---
title: "Linux Datetime API"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- linux
---

"seconds/microseconds/etc. since the epoch" is approximate. See "NOTES" of `man 2 time`.

Types:
- `time_t` (C99): second
- `suseconds_t` (POSIX): microseconds (10^-6 sec)
- `struct timeval` (POSIX): `time_t` (second) + `suseconds_t` (microseconds)
- `struct timespec` (C11 | POSIX): `time_t` (second) + `long` (nanosecond)
- `struct tm` (C89): for break-down time only, precision to second.

## The `clock_*()` family

`clockid_t`: An integer type identifying a specific clock.

Each clock is said to have a precision. If a calendar time that is not a multiple of `clock_settime()`.

### `clock_gettime()` (POSIX)

Kernel reads `/etc/localtime` for time zone configuration. See `man 5 tzfile` for its format.

