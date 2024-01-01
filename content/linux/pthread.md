---
title: "Memo: pthread"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Thread Termination vs. Process Exit

A thread terminates in one of the following ways:
 
> * It calls pthread_exit(3), specifying an exit status value that is available  to  another  thread  in  the  same  process  that  calls pthread_join(3).
> 
> * It returns from start_routine().  This is equivalent to calling pthread_exit(3) with the value supplied in the return statement.
> 
> * It is canceled (see pthread_cancel(3)).
> 
> * Any  of  the  threads in the process calls exit(3), or the main thread performs a return from main().  This causes the termination of all threads in the process.
>
> <cite>-- man 3 pthread_create</cite>

The process of a pthread-ed program exit only when:

- The last active thread is terminated; Or
- Any thread called `exit()`; Or
- `main()` function returns;

Meaning that, if the main thread called `pthread_exit()` before returns from the `main()` function. The whole program, instead of just terminateing, will wait for other active threads to end, if any.

## Return Value from Thread

The entry function of a thread specified in the `pthread_create()` call has the signature `void *(*) (void *)`, meaning that it can return an arbitrary pointer. This return value can be captured in the `pthread_join(pthread_t, void**)`.

## `pthred_attr_t` attr

10 attributes can be specified by this type:
- detach state
    whether calling pthread_create with this attr will create a detached thread.
- scope
- stack size (!)
- stack address (!) # all cloned linux tasks can see each other's stack

```plain
pthread_attr_setaffinity_np (3) - set/get CPU affinity attribute in thread attributes object
pthread_attr_setdetachstate (3) - set/get detach state attribute in thread attributes object
pthread_attr_setguardsize (3) - set/get guard size attribute in thread attributes object
pthread_attr_setinheritsched (3) - set/get inherit-scheduler attribute in thread attributes object
pthread_attr_setschedparam (3) - set/get scheduling parameter attributes in thread attributes object
pthread_attr_setschedpolicy (3) - set/get scheduling policy attribute in thread attributes object
pthread_attr_setscope (3) - set/get contention scope attribute in thread attributes object
pthread_attr_setstack (3) - set/get stack attributes in thread attributes object
pthread_attr_setstackaddr (3) - set/get stack address attribute in thread attributes object
pthread_attr_setstacksize (3) - set/get stack size attribute in thread attributes object
```

detach a thread
--------------
A thread is either joinable or detached.  Once it's detached,
it cannot be joined or made joinable.

When the main thread returns from `main()` or any threads calls
`exit()`, the detached thread still get terminated: Being detached
only determines what will happen when the detached thread end.


## `cond` & `condattr`

Thread that wishes to block upon a cond must acquire the lock that will be associated with the cond first.

`man 3p pthread_cond_timedwait`:

> The application shall ensure that these functions are called with mutex locked by the calling thread.

It's UB to `pthread_cond_destroy` a cond upon which some threads are being blocked. (`man 3p pthread_cond_destroy`)

attributes:
- process-shared

  determine whether the cond variable initialzied with this condattr can be shared across processes
  (TODO: linux shm; vma 1 of process A and vma 2 of process B are mapped to the same physical memory ... ?)

- clock

  related to the timing service of a cond variable (e.g. pthread_cond_timedwait() )
  TODO
