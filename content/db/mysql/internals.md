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

