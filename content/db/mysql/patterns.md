---
title: "SQL Locking Pattern"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- elk
- elastic
- database
---


## pessimistic locking #1

```sql
CREATE TABLE `lock_table` ( 
    `id` BIGINT NOT NULL AUTO_INCREMENT, 
    `flag` int NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT UNIQUE KEY (flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4


INSERT INTO lock_table(flag) VALUES (1)
-- OBTAIN AUTO GENERATED KEY as x
-- GO EXCLUSIVE BUSINESS
DELETE FROM lock_table where id = x
```

One client will succeed in inserting, while all other client will get a `duplicated unique key "flag"` error on insert.

cons:
1. releasing the lock relying on the `DELETE` statement, which once failed causing the lock to be permenant.


