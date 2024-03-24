---
title: "Spring Data: Why I recommend against `@Transactional`"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- spring data
- transaction
- database
- java
---

3 reasons why `@Transactional` should be avoided in your production code.

<!--more-->

## Infamous Self-invocation

A well-known limitation of Spring AOP is that invoking a method within the same class will not be interception.

```java

```

## Bad Granularity Control & Code Clarity

```java
```

## AOP Order Madness

This is probably the most gotcha scenario where `@Transactional` can break the whole game:

```java
@RedisLock
@Transactional
public void foo() {
    // ...
}
```
