---
title: "Redis 常见业务场景用法"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- database
- redis
---

## General notice:

- Always set TTL, unless the key is meant to be permenant.
    - Atomic problems arise when you need more than 1 commands to set TTL, e.g. `INCR + EXPIRE`. Use transaction properlly.
    - Failure to set TTL cause a key to errorneously exist forever, known as "key leak".


## 限流 / 频率控制

key 粒度通常以用户 (登录态 / IP / etc...) 为单位。

Quick Facts:
- race condition 非常非常 容易发生
- `INCR` 无法同时设置 expire。多条指令需考虑原子性。
- 除非事务，避免使用 `GET + INCR`，容易招来原子性问题。
- If `key` is unset, `GET key` return `nil` (`null` for Java `Jedis#get`).
    - 

## 时间切片敏感key

