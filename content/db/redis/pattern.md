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

方案来自 https://redis.io/commands/INCR Rate limiter 1
```
MULTI
INCR key
EXPIRE key <#sec>
EXEC

cnt = response of INCR
if (cnt > THRESHOLD)
    return "rate overflow"

your business goes here
```

## 固定时间切片

错误示范1:

```
boolean isKeyExist = EXISTS key
if (isKeyExist == 1)
    cnt = INCR key
    if (cnt > THRESHOLD)
        return "rate overflow".
else
    SET key 1 EX <#sec>
```

```
global clock tick
        |   thread 1: find key not exist
        |   thread 2: find key not exist
        |   thread 1: set key to 1
        |   thread 2: set key to 1
        |   
        |   !!! now we have 2 visits but the counter is still 1
        |
        V
```

race condition 错误示范1：

```
counter = GET key

if (counter is nil)
    SET key 1 EX <#sec>
else if (counter <= THRESHOD)
    INCR key
else
    return "rate overflow".

your business goes here ...
```

```
global clock tick

        |   thread 1: find counter is nil
        |   thread 2: find counter is nil
        |   thread 1: set key to 1
        |   thread 2: set key to 1
        |   
        |   !!! now we have 2 visits but the counter is still 1
        |
        |
        V
```

## 固定时间切片2

该写法来自 redis 开发组推荐的 basic pattern:

```
counter = GET key
if (key unset || counter < THRESHOLD)
    MULTI
    INCR key
    EXPIRE key <#sec>
    EXEC
else
    return "rate overflow"

your business goes here
```

Pros:
- 简单

Cons:
- partition 化的时间切片限流，无法实现诸如 *“任何连续 24 小时内访问不得超过 100 次”* 这种【连续时间】的需求。
    
    例如在某天的 0 点访问 1 次，在 23:59:59 访问 99 次，在下一秒 (第二天 0 点) 访问 100 次，相当于 2 秒内访问了 199 次。

## 自然天为单位

