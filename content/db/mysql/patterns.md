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


## pessimistic locking #2

```sql
CREATE TABLE `lock_table` ( 
    `id` BIGINT NOT NULL AUTO_INCREMENT, 
    `is_locked` int NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT UNIQUE KEY (flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

UPDATE lock_table SET is_locked = 1 where id = "SOME_LOCK_ID" and is_locked = 0;
-- GO EXCLUSIVE BUSINESS iff. affected row == 1
UPDATE lock_table SET is_locked = 0 where id = "SOME_LOCK_ID" and is_lcoked = 1
```

## `FOR UPDATE` trick

```sql
CREATE TABLE `lock_table` ( 
    `id` BIGINT NOT NULL AUTO_INCREMENT, 
    `flag` int NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT UNIQUE KEY (flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4


SELECT * FROM lock_table where id = 1 FOR UPDATE
-- your business goes here
COMMIT
```

## optimistic locking

```sql
CREATE TABLE `optimistic_lock` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `resource` int NOT NULL COMMENT 'business field',
