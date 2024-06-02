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
