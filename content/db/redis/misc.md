---
title: "Redis Misc"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- database
- redis
---

redis.conf
-------

The main config file on archlinux is `/etc/redis/redis.conf`. Different distros may differ.

Benchmark
----------
https://redis.io/topics/benchmarks

If [command pipeling](https://redis.io/topics/pipelining) is enabled, a single Redis server instance can deliver 1 million QPS over a loopback TCP connection.

<!-- TODO: in cluster. -->

Simple Distributed Lock
--------
`SETNX` was historically used to implement inter-client (i.e. distributed) lock.

1. A client acquire the lock by `SETNX lockname <cur_timestamp+lock timeout+1>` (1);
2. Lock owner client release the lock by `DEL lockname`;
3. Other clients contending for the lock by also performing (1):
    - This is natively a non-blocking tryLock()
    - For client that's willing to block for the lock, suspend the redis communication thread using application code.
4. Once a redis client acquires the lock, it should also `EXPIRE lockname`

This pattern is now **deprecated** in favor of the Redlock algorithm. 

Load hotspot data from db to redis
--------

