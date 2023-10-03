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

Common policy to load data from db to redis is when request data is not found in redis. That is:

1. Request for certain data comes in
2. We check if the request data is directly available from redis;
    1. if yes, return those in cache
    2. if no, read from underlying db, and put data into redis in a designed fashion using application logic.

Problems arises when huge # of requests for non-existent data (not even in database) comes. With the policy above we will have all queries directly goes to the db, equivalently ignoring the cache. But since we know those record doesn't exist in db after the first query, it doesn't make sense to apply subsequent queries to db.

Solutions are:
1. Everytime we find requested data do not exist in the db, we also set a key mapping to "null" (or other sentinel string value) with a short expire period, so that before this redis key expire, all request for invalid data are intercepted and answered by redis.
2. Bloom filter.

    Bloom filter is a probabilistic data structure that answer set membership query with either "definitive no" or "maybe yes", i.e. false positive is possible. Use bloom filter to memorize all possible records in db. This requiers only constant space. Everytime a request for data record come, we first query membership of that record from the bloom filter.
    1. If BF respond with "definitive no", we don't even bother a tentitive `GET` from redis.
    2. If BF says "maybe yes", then we execute the first solution normally.

Max-memory Policy
---------

