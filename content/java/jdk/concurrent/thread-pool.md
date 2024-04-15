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

So far this hierarchy simply accepts tasks and runs them; There is nothing to do with thread pooling yet: an implementation may choose to run the submitted tasks in any thread (even the calling thread - thus blocking) in any way (e.g. create a new thread for each task without reusing).
It is the subclass `public class ThreadPoolExecutor extends AbstractExecutorService` that executes submitted tasks with pooled threads.

## `ThreadPoolExecutor` (TPE)

`ThreadPoolExecutor` is the implementation of `ExecutorService` that is guaranteed to use a thread pool.
Its internal structure can be easily understood by studying the most argument-rich constructor:

*(TPE has 4 [telescoping constructors](https://medium.com/@modestofiguereo/design-patterns-2-the-builder-pattern-and-the-telescoping-constructor-anti-pattern-60a33de7522e), so the other 3 aren't very interesting - see defaults below)*

```java
public ThreadPoolExecutor(  int corePoolSize,
                            int maximumPoolSize,
                            long keepAliveTime,
                            TimeUnit unit,
                            BlockingQueue<Runnable> workQueue,
                            ThreadFactory threadFactory,
                            RejectedExecutionHandler handler) {
}
```

A `ThreadPoolExecutor` uses a blocking queue to buffer submitted tasks.
It keeps `corePoolSize` threads alive even in the most idle time, and creates new threads to handle incoming tasks if
all `corePoolSize` threads are currently busy. In all cases, no more than `maximumPoolSize` threads will be managed by this TPE.
New threads are created by calling the strategy interface `threadFactory`.
Non-core threads are free-ed after being idle for a period of time defined by `keepAliveTime + unit`.
`handler` is another strategy interface that determines

For simpler constructors:
- `threadFactory` defaults to be `Executors.defaultThreadFactory()`, which returns a new `Thread` instance by simply calling the `new Thread()` constructor.
- `handler` defaults to `new AbortPolicy();`.



### What happens if a TPE can't execute a task

`RejectedExecutionHandler` is a strategy interface.

`ThreadPoolExecutor` has 4 static nested classes that implements this interface, representing 4 different ...:
- `DiscardOldestPolicy`:
- `AbortPolicy`:
- `CallerRunsPolicy`:
- `DiscardPolicy`:

One of the `ThreadPoolExecutor` constructors allows specifying a `RejectedExecutionHandler` strategy instance.

The problem being that a user holding an TPE instance now can't be sure what happens when `subimt` is called.
Simply calls



<!--

So far, some problems still present:
1. There is no guarantee on which thread will be arranged to run the task.
2. There is no informaion about what happens when the thread pool is not willing to accept new tasks. -->

## Predefines implementations

JDK provides a few useful implementation of `ExecutorService`
