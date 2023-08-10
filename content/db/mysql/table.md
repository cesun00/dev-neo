---
title: "MySQL Table and View"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
---

Table Info
-------------

A "table" can refer to both tradition table (termed "base table") or view. They are equally returned upon `SHOW TABLES;`. Use `SHOW FULL TABLES;` to print their type as well.

The following statements provides more infomation about tables in a database, and a specific table:

```sql
SHOW TABLE STATUS FROM <db_name>;
SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='db_name/table_name' \G
```

Row format
------

4 row format are supported by InnoDB: `REDUNDANT`, `COMPACT`, `DYNAMIC`, and `COMPRESSED`.

```sql
# show the default, normally its `DYNAMIC`
SELECT @@innodb_default_row_format;
```

### DYNAMIC

View
----------

A view is a stored query. The `ALGORITHM = ...` clause determines whether a new query is issued every time the view is selected from, or a cached temporary table should be used. Of course creating a view does not produce a corresponding table file (tablespace).

The syntax to establish a view:

```sql
CREATE [OR REPLACE]
[ALGORITHM = ... ]
[DEFINER = ... ]
VIEW `view_name`
AS  
```

```sql
show tables;
# +-----------------+
# | Tables_in_world |
# +-----------------+
# | city            |
# | country         |
# | countrylanguage |
# +-----------------+

CREATE VIEW poplarge AS SELECT * FROM city where Population >10000000;
# Query OK, 0 rows affected (0.02 sec)
