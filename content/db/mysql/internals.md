---
title: "MySQL DevOps / Technical Interals"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
---

## data dictionary

MySQL "data dictionary" is the runtime structure where all important metadata (e.g. views, stored procedure, triggers, <!--TODO:--> user tables columns structure  ...) in the current server instance are stored. 

Modern version of MySQL persists the data dictionary also as InnoDB tables, thus providing the same transaction ability and crash-recovery as ordinary user tables. These tables are hidden, and is in the `mysql` schema. They can only be seen in a debug build (`cmake -DWITH_DEBUG=1`). The tablespace storing data directory is `mysql.ibd`, whose name is hardcoded and can't be change.

Another related schema is the `information_schema`. It's not a real schema, as it has no corresponding files or schema directory on the filesystem. All tables inside are read-only views (`Table_type = SYSTEM VIEW`), and can't have triggers. The design feels like the linux pseudo filesystems e.g. `/sys` or `/proc`.

Selecting from views `information_schema` is meant to be a more consistent way to show metainfo about other databases, comparing to the `SHOW` family. For example:

```sql
-- both show all schemas
SHOW DATABASES;
SELECT ///

SHOW TABLES;
SELECT
```


## Doublewrite Buffer

Before writing to the persistent storage, InnoDB first flush data to a on-disk buffer known as the doublewrite buffer. The primary reason for such design is to prevent "torn page". If all changes are directly written to persistent files, a power outage may leave the changes partially written, and there is no way to recover or even discover such error/inconsistency.

Instead, changes are first written to the doublwrite buffer, which won't be invalidated until the real write succeed. If a fatal failure happen, InnoDB can use what is left in the doublewrite buffer to recover the state.

Before MySQL 8.0.20, the doublewrite buffer resides inside the system tablespace (`ibdata1` by default), but now a dedicated doublewrite buffer file is used.

Some related system variables are:
- `innodb_doublewrite`: boolean for enabling/disabling doublewrite.
- `innodb_doublewrite_dir`: directory to put doublewrite buffer files in; `NULL` fallback to `innodb_data_home_dir`, whose being `NULL` in turn fallback to server data directory (for me `/var/lib/mysqld/`)
- `innodb_doublewrite_files`: integer; the # of doublewrite buffer files for each buffer pool instance;

Extra IO to the doublewriter buffer isn't as expensive as one might think, since 

## Tablespace

A tablespace is logical collection of tables and/or indexes (both are b+tree anyway).

Tablespace is also the unit of disk page management. All pages in the same tablespace are of the same size (default 16KiB).

1 tablespace corresponds to exactly 1 file under the mysql data directory `/var/lib/mysql/`. The only exception being the unique system tablespace, which can have more than 1 files, and contains other stuffs like the change buffer. See [this](https://dev.mysql.com/doc/refman/5.6/en/innodb-system-tablespace.html#innodb-resize-system-tablespace) for configuring multiple files for the system tablespace.

Table `information_schema.INNODB_TABLESPACES` provides info about all tablespaces in the current server instance, except the system tablespace (`NAME=innodb_system`, the missing 1 below). Table `information_schema.FILES` show all files managed by the server:

```sql
SELECT FILE_ID,FILE_NAME,FILE_TYPE,TABLESPACE_NAME
FROM FILES
WHERE TABLESPACE_NAME NOT IN (SELECT NAME FROM INNODB_TABLESPACES);

