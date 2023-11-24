---
title: "MySQL MISC"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- SQL
- mysql
- database
---

test null json
--------
```sql
select * from lark.task_detail where task_id = 100329 and task_resource = CAST('null' as JSON);
```

Limits
----------
1. Max # of indexes per table is 64.
2. Max index width for InnoDB table is 767 or 3072 bytes.
3. Max # of columns per table is 4096, but almost always we can't reach that number, since other factors are also limiting the # of columns per table.

User
-----------

### User

At its simplest form, create a user with no password and no privileges:

```sql
CREATE USER IF NOT EXISTS <user>;
```

### Privilege

```sql
# print all privileges granted
SHOW GRANTS [FOR user]
`GRANT` implicitly creates user is not exist:
GRANT USAGE ON *.* TO 'user123'@'%' IDENTIFIED VIA PAM using 'mariadb' require ssl ;
```

### Role
A role is a bundle of privileges. By assigning an user a role, that user gets all the privileges in the role bundle. Here goes the thought of (multiple) inheritance.