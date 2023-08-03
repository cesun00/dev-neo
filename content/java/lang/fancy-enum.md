---
title: "Enum Implements Interfaces"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- java
---

`enum` in Java is a syntax sugar of `class ... extends Enum<>`.
It shouldn't be surprising that it can thus implement interfaces.
This article discusses some less-known consequences of that.

<!--more-->

In the basic cases an enum. An 

```java
public enum FooEnum implements Executor {
    GG,
    KK,
    ;

    @Override
    public void execute(Runnable command) {
        System.out.println("foo");
    }
}
```

This is perhaps not very useful, as all instances of `FooEnum` have the same behavior as an `Executor`.
Actually, each enum instance can have a different implementation of the interface:

```java
package com.example.bootdemo;
