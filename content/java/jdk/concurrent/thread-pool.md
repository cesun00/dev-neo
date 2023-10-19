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

    // shutdown request and management
    void shutdown();
    List<Runnable> shutdownNow();
    boolean isShutdown();
    boolean isTerminated();
    boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException;


    // better task submission APIs
    <T> Future<T> submit(Callable<T> task);
    <T> Future<T> submit(Runnable task, T result);
    Future<?> submit(Runnable task);


    // convenience methods for running all / any task(s) in a collection, and block until all have / any has completed
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)                              throws InterruptedException;
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit) throws InterruptedException;
    <T> T invokeAny(Collection<? extends Callable<T>> tasks)                                            throws InterruptedException, ExecutionException;
    <T> T invokeAny(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit)               throws InterruptedException, ExecutionException, TimeoutException;
}
```

Changing the task submission APIs to accept `Callable<T>` and return `Future<T>` permits type-safety and exception-tolerance codes.
Also, methods that allow graceful handling of thread pool shutdown and resource reclamation are added.

`java.util.concurrent.AbstractExecutorService` is the base implementation containing the common logic of all `ExecutorService`.
All methods have been implemented (though the template method pattern is employed to leave some customization space for subclasses) except the 5 shutdown-handling ones, since shutdown codes are usually implementation-specific (see below).

