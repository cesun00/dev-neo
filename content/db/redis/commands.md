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

    In production the redis key set is usually large. Given the single-threaded nature of redis, a `KEY *` command can easily block the server.
    See below `SCAN` for an alternative.

- `SCAN cursor [MATCH pattern]`

    Iteratively list all keys (with `MATCH pattern`, only keys that matches `pattern`) in the redis server.
    `SCAN` is cursor based: to do a full iteration, first `SCAN 0`, and use the returned integer as the next `cursor`.
    Server returns 0 to indicate that a full iteration is finished.
    Properties of `SCAN` and its `[SHZ]SCAN` family:
    1. About changes during the iterative scanning:
        1. If lifetime of a key completely cover the scan (i.e. exist before `SCAN 0` and never die before server return 0),
        it's guaranteed to returned to the client at some point.
        2. If a key die before start of the SCAN, it's **never** returned to the client.
        3. Otherwise, either an existing key is deleted or a new key is added during the scan. Integrity is undefined for those cases.
    2. As new keys are added, the same element might be returned multipled times. **Application needs to unique the result if necessary**.
    3. The number of elements returned per step in the iterative scanning is **non-determinisic**: keep scanning until server returns 0.

- `EXISTS key`: membership query of key in the top level space

- `TYPE key`: inspect the data type of `value` that is associated with `key`

### Memory Monitoring

- `MEMORY USAGE key`

    Report the number of byte used by `key` itself and the associated value.

    ```redis
    127.0.0.1:6379> SET a 0
    OK
    127.0.0.1:6379> SET b ""
