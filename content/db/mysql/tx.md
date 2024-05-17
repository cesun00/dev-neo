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

### Intention Lock for Table

Intention lock a pair of table-level readers-writer locks that a transaction must acquire before it can proceed to read/write that table. Their names are "intention shared lock (IS)" and "intention exclusive lock (IX)".

Intention lock exists primarily for performance reason: https://stackoverflow.com/questions/33166066/why-do-we-need-intent-lock

A protocol is designed 

### Explicit Locking

Interestingly enough MySQL exposes some explicit locking interface to the SQL language. I wonder if they have any practical programmatic use. All these functions acquire/release locks for **the current session** (and of course there is no way to get/release locks for other sessions):

#### Named Lock

```sql
# acquire a named lock; negative `TIMEOUT` blocks forever
GET_LOCK("named_lock",TIMEOUT); 

# released the named lock
RELEASE_LOCK("named_lock");

# trylock
IS_FREE_LOCK("named_lock")
IS_USED_LOCK("named_lock")

# release all
RELEASE_ALL_LOCKS()
```

#### Explicit Table Lock

https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html

```sql
LOCK TABLE[S] <table> [READ|WRITE]
```

### Metadata Locking
https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html

### Row Locking

### Range Lock (not a thing?)

### Gap Lock

### Locking vs Non-locking Read	

Isolation Level
---------

Isolation level is the answer to the question: "Inside a transaction, to what extent can I observe the results of writes in other transactions that happen concurrently.

InnoDB supports 4 isolation level, from the lowest protection to the highest:

1. `READ UNCOMMITTED`

	Under RU, reads in a transaction could see writes from other transactions even before those transactions are committed. This is dangerous since one might see partial result. Using RU requires special care.

	The fact that reads inside a transaction see uncommitted writes from other transaction is called "dirty reads".

2. `READ COMMITTED`

	Under RC, reads in a transaction can only sees changes made by other transactions that have alread committed.

	Each non-locking `SELECT` inside a transaction see a fresh snapshot, i.e. consecutive non-locking `SELECT` may see different snapshots.

	2 consequences of such different snapshots are:
	
	1. "Non-repeatable read": The same row is read twice, but its values changes.
	2. "Phantom rows": The same query is issued twice, but more rows is returned in the second time.

	Under RC, both can happen.

	TOD: Gap locking is never used. Phantom rows can happen.

2. `REPEATABLE READ` (default IL for InnoDB)

	Like RC (i.e. only see committed changes), except:

	1. multiple non-locking `SELECT` inside a transaction will see **the same** snapshot, taken when the first `SELECT` is executed, or when a transaction starts with `WITH CONSISTENT SNAPSHOT` (RR is also the only IL that allows this clause).
	2. For statements that requires locking (e.g. `UPDATE`, `DELETE`, `SELECT ... FOR UPDATE`, ...):
		- For unique index with unique search condition, only index record will be locked; gap won't be locked;
		- For other search, gap locks or next-key locks will be used.
	
	Under RC, dirty read and non-repeatable read are eliminated, **but phantom read can still happen!**.

4. `SERIALIZABLE`

	Like RR, but 

Here is a chart for summary:

| IL               | Dirty read | Non-repeatable read | Phantom read |
|------------------|------------|---------------------|--------------|
| READ UNCOMMITTED | ✓          | ✓                   | ✓            |
| READ COMMITTED   | x          | ✓                   | ✓            |
| REPEATABLE READ  | x          | x                   | ✓            |
| SERIALIZABLE     | x          | x                   | x            |

### Get/Set isolation level

To change server's default isolation level on startup, either use the `--transaction-isolation` CLI flag or set `transaction_isolation` sysvar in my.cnf.

Inside a client, isolation level can be change at global, session, or per transaction level:

```sql
SET [GLOBAL|SESSION] TRANSACTION
	ISOLATION LEVEL [SERIALIZABLE|REPEATABLE READ|READ COMMITTED|READ UNCOMITTED]
	[READ WRITE|READ ONLY] # access mode can be set at the same time
```

Such `SET TRANSACTION` can appear either between transactions, or inside a transaction. Note that the `SET` statement is not part of a transaction, since it does not read/write data or change data definition. The scopes are:
1. `GLOBAL` changes the isolation level globally for all new session; existing session are unaffected.
2. `SESSION` changes the IL for all subsequent transactions in the current session. If appears inside a transaction, it does not affect that ongoing transaction.
3. If neither of `GLOBAL` or `SESSION` is presented, the isolation level is only changed for the next transaction in the current session. Then IL will be reset to the session scope IL.

Get the current IL:

```sql
SELECT @@Global.transaction_isolation; # global IL
SELECT @@Session.transaction_isolation; # session IL
SELECT @@transaction_isolation; # IL for next transaction

# Note that in autocommit mode, such SELECT is also a transaction,
# meaning that any change to next-transaction IL will be reset to session IL,
# and the last SELECT doesn't reflect the change.
```


Rollback
------------

Cascade rollback:

Snapshot Isolation / Consistent Read / Multiversioning
---------

Consistent read refers to the fact that, for plain lock-less `SELECT` (in contrary to `SELECT ... FOR [SHARED|UPDATE]` which locks rows), MySQL provides a snapshot of the database, instead of actually trying to acquire locks for tables/rows. This features enables a non-blocking plain `SELECT`, even when querying rows locked by other transaction.

Given that the isolation level is, "The moment" is one of the following:
