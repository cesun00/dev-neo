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

<!-- When designing an index containing multiple columns, some considerations are:

-  -->

<!-- Query via index
------- -->

Disk Page
----------

"Page" is the unit InnoDB used to manage disk storage. Yes, the naming sucks.

The size of a page is configured on a per-tablespace basis, and can be queried by `SELECT @@innodb_page_size`; Its value is fixed once the current `mysqld` instance is initialized. To change its value, change `innodb_page_size` prior to initialization. The default is 16 KiB, with 4,8,32,64 KiB also supported.

Each page stores a leaf node in the B+Tree of the clustered index or secondary index. For clustered index/secondary, we hope more rows / (PK,index columns) entries fit into a page, so that one page read brings more info we need. We also hope that leaf nodes are consecutive on disk, so that a sequential disk read gives us rows/record in the order defined by the primary key / secondary index. Such consective-ness is now always attainable, since (TODO...)

Clustered Index
-------
Every InnoDB table has a special index called the clustered index. Clustered Index corresponding to the B+-tree that physically store the rows on the disk.

1. If the table has a primary key, it is used as the CI; otherwise
2. the first `UNIQUE` index containing all `NOT NULL` columns are used; otherwise
3. a hidden index named `GEN_CLUST_INDEX` on a hidden 6 byte mono-increasing column is used.

It's an very bad idea 


Secondary Index
-------

