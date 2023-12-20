---
title: "Redis Commands"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- database
- redis
---

Top Level Command
----------
### Remove key
- `DEL key ...`: variadic delete keys; no wildcard support
    
    Complexity of `DEL key` a single key is `O(M)`, `M` being the number of elements in the data structure associated with `key`. This means that deleting a string is O(1), but deleteing a data structure containing large number of objects (say a list of 50 million values) is slow. Given that redis is still (mainly) single-threaded epoll for now (version 6.2.1), this means **`DEL` could block all other requesets for a long time.** 

    See `UNLINK` for non-blocking delete, which runs in O(1) and employ a background garbage collecting thread to do the real delete.

### Expiration

- `EXPIRE key sec`, `PEXPIRE key millisec`: Prescribe that `key` gets deleted in `sec` second/ `millisec` milliseconds.
	- This computes and persists on the disk the timestamp of the instant of expiration, thus the behavior is always correct even if redis server is down.
	- The resolution is always millisecond.
	- Can be used to re-set a new expire time if previously has one.
    - Note that `key` can identify a data structure, not only string. For string we have a native one-liner syntax `SET key value [EX sec|PX millisec]` to set expiration.

- `TTL key`, `PTTL key`: query living time in seconds/milliseconds
    - return -1 for LIVE FOREVER
	- return -2 if key DOES NOT EXIST (may be already expired or never ever existsed)

- `PERSIST key`: cancel the expiration schedule of `key`.

### Key Queries
- `KEYS pattern`

    list all keys that match the UNIX wildcard `pattern`.
