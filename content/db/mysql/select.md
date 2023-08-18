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
