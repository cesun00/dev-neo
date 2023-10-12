---
title: "MySQL Variable"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- sql
- mysql
- database
---

User-Defined Variable
---------

https://dev.mysql.com/doc/refman/8.0/en/user-variables.htm

UDV can only stored a scalar value, e.g. the result of an aggregation function. For storing non-scalar result of a query, see [temporary table](../mysql-select#temporary-table).

Note the `:=` operator. `=` operator outside `SET` or `UPDATE <table> SET ...` is considered a equality test.

```sql
SELECT @myvar:=SUM(Population) from city;
# +-------------------------+
# | @myvar:=SUM(Population) |
# +-------------------------+
# |              1429559884 |
# +-------------------------+
# 1 row in set, 1 warning (0.00 sec)

select @myvar;
# +------------+
# | @myvar     |
# +------------+
# | 1429559884 |
# +------------+
# 1 row in set (0.00 sec)
```

If assigning to a whole column, the variable will record the value of the last row:

```sql
SELECT @myvar2:=Population FROM city LIMIT 10;
# +---------------------+
# | @myvar2:=Population |
# +---------------------+
# |             1780000 |
# |              237500 |
# |              186800 |
# |              127800 |
# |              731200 |
# |              593321 |
# |              440900 |
# |              234323 |
# |              201843 |
# |              193238 |
# +---------------------+
# 10 rows in set, 1 warning (0.00 sec)

SELECT @myvar2;
