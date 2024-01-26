---
title: "JDK ExecutorService and Thread Pool"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- java
- multithreading
---

Despite its being a JDK stock utility, the `java.util.concurrent.Executor` hierarchy since Java 1.5 is a fairly good thread pool implementation.

<!--more-->

The `Executor` interface itself, as the root interface, is not very useful due to its simplicity.
It takes a void-returning, no-checked-exception function and promises to run it sometime somehow:

```java
public interface Executor {
    void execute(Runnable command);
}
```

It suffices if you just want to fire some async logic and forget about it forever.
The infamous `Runnable` interface has prevented you from checking or waiting for the completion of submitted tasks.
Also, an adapter must be written if the task function throws any checked exception.

The sub-interface `java.util.concurrent.ExecutorService` fixes these problems and is thus more popular:

```java
public interface ExecutorService extends Executor {

