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

几乎同上，只要用业务代码算出本自然日剩下的秒数。所有 key 当天夜里 0 点整过期。

Pros:
- 简单

Cons:
- key 同时过期，瞬间性能堪忧
- 同样是基于切片的限流，同样存在上一节的问题。

## 连续时间段限流

希望任何连续 24 小时内不得访问超过 100 次.

使用一个 list 记录最近 100 次的请求时间。每次访问:
- 如果 `list size <100`, `rpush now()`
- 否则判断 `LRANGE key 0 0` (左 peek) 是否距离 `now()` 已经过去 24 小时
    - 若是，`lpop` 并 `rpush now()`
    - 若否，超频，驳回。

此处 redis 多次读写，要保证原子性
- 若用 Java 代码实现，需 `BinaryJedis#multi()` 开启事务；据说较为影响性能。
- Lua 编写的 redis 脚本可以将保证原子性的任务交给 redis 服务器，减轻业务代码的负担。