---
title: "SELECT and Optimization Techniques"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
---

The notorious query statement being excessively versatile.

```sql
SELECT [DISTINCT] ...
FROM ... PARTITION ...
WHERE ...
GROUP BY ...
HAVING ...
WINDOW ...
ORDER BY ... [DESC]
LIMIT ...
```

display huge number of columns in terminal
-----

```sql
select * from user\G
```

https://stackoverflow.com/questions/924729/how-to-best-display-in-terminal-a-mysql-select-returning-too-many-fields

Pattern Matching
----

### [NOT] LIKE

```sql
SELECT ... FROM ...
WHERE <column> [NOT] LIKE <pattern>
```

Only 2 meta char allowed:

- `%` matches any number of characters, including zero.
- `_` matches any single character.

### Regex

https://dev.mysql.com/doc/refman/8.0/en/regexp.html

- `REGEXP`/`RLIKE` operators
- `REGEXP_LIKE()` function 

case-insensitive by default;

```sql
select * from pet where owner REGEXP '^b';
+------+-------+---------+------+------------+-------+
| name | owner | species | sex  | birth      | death |
+------+-------+---------+------+------------+-------+
| Fang | Benny | dog     | m    | 1990-08-27 | NULL  |
| Slim | Benny | snake   | m    | 1996-04-29 | NULL  |
+------+-------+---------+------+------------+-------+
2 rows in set (0.000 sec)
```

3 ways to make regex pattern matching case-sensitive:

```sql
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b' COLLATE utf8mb4_0900_as_cs);
SELECT * FROM pet WHERE REGEXP_LIKE(name, BINARY '^b');
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b', 'c'); 
```

For MariaDB:
```sql
MariaDB [menagerie]> select * from pet where owner REGEXP BINARY '^b';
Empty set (0.000 sec)

MariaDB [menagerie]> select * from pet where owner REGEXP BINARY '^B';
+------+-------+---------+------+------------+-------+
| name | owner | species | sex  | birth      | death |
+------+-------+---------+------+------------+-------+
| Fang | Benny | dog     | m    | 1990-08-27 | NULL  |
| Slim | Benny | snake   | m    | 1996-04-29 | NULL  |
+------+-------+---------+------+------------+-------+
2 rows in set (0.001 sec)

```

Aggregate Functions
--------
List of all available aggregate functions:
https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html

Selecting aggregate functions without a `GROUP BY` clause behaves as if there is a single group containing all rows.

### GROUP BY rules

TL;DR: turn on `ONLY_FULL_GROUP_BY`, and use `ANY_VALUE()` when necessary.

One rule for using aggregate functions is that, apart from the aggregate functions themselves, all field selected should also appear in the `GROUP BY` caluse. e.g.:

```sql
SELECT * FROM t;
# +------+------+------+
# | a    | b    | c    |
# +------+------+------+
# |    1 |    1 |  100 |
# |    1 |    1 |  200 |
# |    1 |    2 |  200 |
# |    1 |    2 |  300 |
# |    2 |    1 |  100 |
# |    2 |    1 |  200 |
# |    2 |    2 |  500 |
# |    2 |    2 | 3300 |
# +------+------+------+
# 8 rows in set (0.00 sec)

SELECT a,b,MAX(C),MIN(C) FROM t GROUP BY a,b;
# +------+------+--------+--------+
# | a    | b    | MAX(C) | MIN(C) |
# +------+------+--------+--------+
# |    1 |    1 |    200 |    100 |
# |    1 |    2 |    300 |    200 |
# |    2 |    1 |    200 |    100 |
# |    2 |    2 |   3300 |    500 |
# +------+------+--------+--------+
# 4 rows in set (0.00 sec)
```

One exception to this rule is when the non-aggregate selected columns functionally depend on the `GROUP BY` columns:

```sql
# find how many languages is spoken in each country
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

Here `Code` is the primary key of table `country`. We are grouping by `Code` but we have a non-aggregate selected column `Name`. This is well-defined, since `Code` uniquely identify a country thus its name.

However, even if a non-aggregate selected column doesn't functionally depends on the `GROUP BY` columns, evil mysql still accept such query by default (controlled by `ONLY_FULL_GROUP_BY`), but the result is undefined. 

HAVING Clause
----------

`HAVING` works on the result of the grouping, while `WHERE` clause works on-the-fly while scanning each rows.

There are lots of way to abuse the `HAVING` clause. Without aggregate functions and `GROUP BY`, `HAVING` is the same as `WHERE` (at least mysql behaves the same, not sure about the performance, anyway don't do this, and use `WHERE` instead):

