---
title: "Use Thread Pool in Spring Application"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- java
- spring
- multithreading
---

Spring allows a thread pool construct to be conveniently used by autowiring an `org.springframework.core.task.TaskExecutor` bean.
Under the hood, implementation of this bean delegates to the JDK's stock thread pool implementation.
We will be discussing both in this article.

<!-- more -->

## JDK Thread Pool

Despite its being a JDK stock utility, the `java.util.concurrent.Executor` hierarchy since Java 1.5 is a fairly good thread pool implementation.
Spring's most frequently used `ThreadPoolTaskExecutor` is simply a wrapper around a JDK `ThreadPoolExecutor`.
See [JDK ExecutorService and Thread Pool]({{<ref "../jdk/concurrent/thread-pool.md">}}) for details on JDK's thread pool.

## Thread Pool with Spring

For Spring boot applications, using the thread pool is as simple as injecting an `org.springframework.core.task.TaskExecutor` bean.

`TaskExecutor` is an interface type. A unique implementation bean is configured by `org.springframework.boot.autoconfigure.task.TaskExecutorConfigurations` config class automatically. This can be disabled by ...TODO.

- if the [virtual thread](#TODO) feature since Java 21 is available and Spring was configured to use it (by setting property `spring.threads.virtual.enabled=true`), TODO;
