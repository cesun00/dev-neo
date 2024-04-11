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

### `clock_getres()`

### `clock_settime(CLOCK_REALTIME, ...)`

POSIX left privileges to set a particular clock to be implementation-defined. On linux it's usually `CAP_SYS_TIME` or root privileges.

### `clock_adjtime()`

### `clock_nanosleep()`

## The `timer(fd)?_*()` family

## Legacy API for fun

### Get time / timezone

- `time_t time(time_t *tloc)` (C89 | POSIX)

	Return the # of seconds since the epoch. Has nothing to do with timezone. It is recommended that `tloc` always be `NULL`. (see "BUGS" in `man 2 time`)

- `gettimeofday()` (POSIX)

	POSIX 2008 deprecated `gettimeofday()`. Use `clock_gettime()` instead. This function is subjected to to time leap (e.g. sys admin changes time).

TODO: timezone

### Set Time / TimeZone

- `stime()`
- `settimeofday()`
- `adjtimex()`
- `settimeofday()`

### timer / alarm / sleep

- `sleep()`
- `nanosleep()`
- `usleep()`
- `alarm(second)`

	Let kernel kill a `SIGALRM` to the calling process after specified seconds.

- `setitimer()`

## Breakdown

### `gmtime(_r)`

Converts a calendar time into break-down time in UTC.

### `localtime(_r)`

Converts a calendar time into break-down time in local time zone.

### Build: `mktime`
