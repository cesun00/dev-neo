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

```sql
SELECT Name, Population FROM city HAVING Population>9600000;
# +-----------------+------------+
# | Name            | Population |
# +-----------------+------------+
# | São Paulo       |    9968485 |
# | Jakarta         |    9604900 |
# | Mumbai (Bombay) |   10500000 |
# | Shanghai        |    9696300 |
# | Seoul           |    9981619 |
# +-----------------+------------+
```

Other ways include selecting non-aggregate columns without putting them or their functional dependency into `GROUP BY`:

	```sql
	SELECT * FROM city HAVING Population = MAX(Population);
	# Empty set (0.01 sec)

	SELECT * FROM city HAVING Population > AVG(Population);
	# +------+-------+-------------+----------+------------+
	# | ID   | Name  | CountryCode | District | Population |
	# +------+-------+-------------+----------+------------+
	# |    1 | Kabul | AFG         | Kabol    |    1780000 |
	# +------+-------+-------------+----------+------------+
	```

Those results are apparently wrong. What those queries mean is very different from what they mean in English. Again without a `GROUP BY`, there is only a single big group, and only the result of the aggregate function (which is not selected) makes sense.

Aggregate function is allowed in `HAVING` clause, and forbidden in `WHERE` clause. **But whatever aggregate functions are used in `HAVING` clause, they must appear as well in the `SELECT` columns.** `HAVING` condition is applied on the result of grouping, and aggregate function inside `HAVING` clause won't be done if they haven't already been done as part of the `SELECT` scanning. That is, aggregate functions in `HAVING` are just references, not commands. Actually a symbol is preferred:

```sql
SELECT CountryCode, SUM(Population) AS Pop
FROM city GROUP BY CountryCode HAVING Pop > 70000000;
# +-------------+-----------+
# | CountryCode | Pop       |
# +-------------+-----------+
# | BRA         |  85876862 |
# | CHN         | 175953614 |
# | IND         | 123298526 |
# | JPN         |  77965107 |
# | USA         |  78625774 |
# +-------------+-----------+
```

For the 2 erroneous examples above to work, a subquery is required:

```sql
SELECT * FROM city WHERE Population = (SELECT MAX(Population) FROM city);
SELECT * FROM city WHERE Population > (SELECT AVG(Population) FROM city);
```

Join
----------

The `ON` clause specify a bool expression e.g. `SELECT * FROM t0 JOIN t1 ON t0.b = t1.b`; while the `USING` clause specify the names of columns that must exist in both table, e.g. `SELECT * FROM t0 JOIN t1 USING(b);`. Those 2 examples are effectively the same, except that the `USING` one don't produce column `b` twice.

- `[INNER|CROSS] JOIN [ON|USING ...]`

	If the `ON|USING ...` clause is absent, whole cartesian product will be output, i.e. the same as the comma concatenation of 2 tables in the `FROM` clause.

	If the `ON|USING ...` clause is presented, among all rows in the cartesian product, only those that matches the condition will be output.

	`STRAIGHT_JOIN`: TODO

- `LEFT [OUTER] JOIN ON|USING ...`

	`ON|USING ...` clause must be presented.

	For each row in the left table, for each row in the right table that matches the condition, a joined row is output. If no row from the right table matches, a joined row (current left table column , null row table column) will be output.

- `RIGHT [OUTER] JOIN ON ...`

	Same as `LEFT JOIN` but the other direction. Note that by exchanging position of the 2 tables, a `RIGHT JOIN` can always become `LEFT JOIN`.

- `NATURAL [INNER] JOIN`
	
	Equivalent to `... t0 JOIN t1 USING(<all common column names in t0 and t1>)`.

- `NATURAL LEFT [OUTER] JOIN`

- `NATURAL RIGHT [OUTER] JOIN`

- It's not a thing: `OUTER JOIN`/`FULL JOIN`/`FULL OUTER JOIN`

	Mysql does not support `FULL JOIN`, `OUTER JOIN`, or `FULL OUTER JOIN` whatsoever. The fact that the SQL langauge was standardized too late is to blame.

	When people use this type of join in Microsoft SQL Server, what they get is a inner join but:
	1. a row from left table matching no row from right table still produce a row with columns from right table `NULL`;
	2. a row from right table matching no row from left table still produce a row with columns from left table `NULL`;

	This is feels like a combination of `LEFT JOIN` + `RIGHT JOIN`.

	There is a way to emulate this in MySQL:
	https://stackoverflow.com/questions/4796872/how-to-do-a-full-outer-join-in-mysql


### `JOIN` vs `FROM cartesian WHERE`

Note that the performance of the following query should be the same:

```sql
SELECT ...
FROM t0,t1
WHERE t0.xxx = t1.xxx;

SELECT ...
FROM t0 INNER JOIN t1
ON t0.xxx = t1.xxx;
```

Ref: https://stackoverflow.com/questions/121631/inner-join-vs-where

LIMIT and Pagination
---------------

The `LIMIT` clause is extensively used to implement pagination. 3 syntax exist:

```sql
SELECT ... FROM ...  LIMIT n; 				# get the first n rows
SELECT ... FROM ...  LIMIT off,n; 			# skip the first off, then get n rows
SELECT ... FROM ...  LIMIT n OFFSET off;	# ditto but sane syntax
```

[Some best practice](https://stackoverflow.com/a/3799223/8311608) recommends that `LIMIT` clause always be used with the `ORDER BY` clause, even if it's on the clustered index which is no-op, e.g. the example above.

Designating `page_idx` (1-indexed) and `page_size` for what they obviously mean, rows of a page can be queried by:

```sql
SELECT ...
LIMIT page_size OFFSET (page_idx - 1) * page_size;
```

### LIMIT when ORDER BY columns have duplicated values
https://dev.mysql.com/doc/refman/8.0/en/limit-optimization.html

A peculiar phenomenon when combining `ORDER BY` and `LIMIT` is that a query may return rows in a different order comparing to `ORDER BY` **without** `LIMIT`, when those `ORDER BY` columns have identical values on multiple rows:

```sql
SELECT * FROM ratings ORDER BY category;
# +----+----------+--------+
# | id | category | rating |
# +----+----------+--------+
# |  1 |        1 |    4.5 |
# |  5 |        1 |    3.2 |
# |  3 |        2 |    3.7 |
# |  4 |        2 |    3.5 |
# |  6 |        2 |    3.5 |
# |  2 |        3 |    5.0 |
# |  7 |        3 |    2.7 |
# +----+----------+--------+

SELECT * FROM ratings ORDER BY category LIMIT 5;
# +----+----------+--------+
# | id | category | rating |
# +----+----------+--------+
# |  1 |        1 |    4.5 |
# |  5 |        1 |    3.2 |
# |  4 |        2 |    3.5 |
# |  3 |        2 |    3.7 |
# |  6 |        2 |    3.5 |
# +----+----------+--------+
```

Since the order of rows returned is non-deterministic when `ORDER BY` columns have identical values on multiple rows, relying on such behavior is insane already, set aside wondering why `LIMIT` changes the order. Anyway, just knowledge for fun.

LIMIT ... OFFSET is slow
--------

MySQL cannot seek directly to the `OFFSET ...` row on the disk, cause it's not sure how many rows are there in each page (recall that each page is not necessarily full, actually usually half to 15/16 full).

This means that even a `LIMIT ... OFFSET ...` query even `ORDER BY` the clustered index will brings a full table scan up to the `offset+limit`.

The correct way is to write a range condition on the PK based on the page # and row per page:

https://stackoverflow.com/questions/4481388/why-does-mysql-higher-limit-offset-slow-the-query-down

Considerations for `ORDER BY`
-------

1. You can `ORDER BY` multiple columns. The ordering of the first designated column has the highest priority.

2. When the `ORDER BY` columns have identical values on mutiple rows, the order of those rows upon return is not deterministic. `ORDER BY` more columns you care to solve this problem. There is even no guarantee that, the first 5 rows returned by `ORDER BY`

3. When a query is `ORDER BY` indexed columns, there is no need to really sort anything.

