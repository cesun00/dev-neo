---
title: "MySQL Index"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
---

Primary Key
---------

Primary key, if presented, is used as the clustered index, meaning that it determine the order of row on disk. Refman recommends that one always specifies a PK when creating a table. When choosing PK, the following columns are recommended by the refman:

- Columns that are referenced by the most important queries.
- Columns that are never left blank.
- Columns that never have duplicate values.
- Columns that rarely if ever change value once inserted.

Composite Index
----------

A composite index is an index consists of multiple columns. Such index can be used (to accelerate queries) when a prefix of those columns are tested, i.e. the first column, the first 2 columns, the first 3 columns, ..., all columns. So it's obviously important to specify columns in a composite index **in the right order**.

