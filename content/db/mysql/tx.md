---
title: "MySQL Transaction"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
- transaction
---

Locking
--------

Locking is heavily used in any database system to ensure ACID. 

MyISAM only supports locking at table level, i.e. readers-writer lock on each entire table. No other level of protection are supported. Apparently, such granularity of locking is too large, and is detrimental the concurrency of transactions. Well, MyISAM doesn't support transaction, anyway.

InnoDB supports transaction, and claim itself supports "multiple granularity locking", meaning that both table level and row level locks are supported.

We only discuss InnoDB here.

### Readers-Writer Lock for Row

The pattern of Readers-Writer Lock are extremely common in MySQL. It is used to protect concurrent accesses to **rows in a table**.

Reader lock is renamed as "shared (S) lock" or and writer lock is known as "exclusive (X) lock", just as those terms in C++14. Note again that, when we talk about S/X locks, we are talking about row-level locks.

Some explicit locking SQL statements take extra clause to specify whether you want to acquire a S lock or X lock. The most common one being:

```sql
SELECT ... FOR [UPDATE|SHARED];
```

`UPDATE` acquires the X lock on the selected rows, and `SHARED` acquires the X lock, both until the end of the current transaction.
