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

import java.util.concurrent.Executor;

public enum FooEnum implements Executor {
    GG("12323", 42) {
        @Override
        public void execute(Runnable command) {

        }
    },
    KK("332",22) {
        @Override
        public void execute(Runnable command) {

        }
    },
    ;

    private String code;
    private int value;


    FooEnum(String code, int value) {}
}
```

Note that:
1. This cause a anonymous class thus separate `.class` files to be generated for each enum instance. 
2. 

This technique is can be used to implement the strategy pattern, 

Instances of such enum can implements its own abstract methods
An example from Spring boot's `autoconfigure` package:

```

```


If there is no fallback behavior, the method implementation can be completely removed from the `enum` body
without causing an syntax error: