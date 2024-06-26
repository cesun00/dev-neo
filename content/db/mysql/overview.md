---
title: "MySQL Basics"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- mysql
- sql
- database
---

Installation
-----------

Grab from AUR. Don't forget to change `MAKEFLAGS` (e.g. `-jn` for parallel compilation) in `/etc/makepkg.conf` if this is the first time aur package is built on the current machine. 

```bash
git clone https://aur.archlinux.org/mysql.git
makepkg -si
```

Default charset and collation are set in `PKGBUILD`:

```pkgbuild
	-DDEFAULT_CHARSET=utf8mb4 \
	-DDEFAULT_COLLATION=utf8mb4_unicode_ci \
```


AUR script `mysql.install` will
1. create group `mysql (gid=89)` and user `mysql (uid=89)` whose primary group is `mysql`.
2. create group `mysqlrouter` and user `mysqlrouter` whose primary group is `mysqlrouter`.
3. create directory `/var/lib/mysql` with `mysql:mysql 700`.
4. create directory `/var/lib/mysqlrouter` with `mysqlrouter:mysqlrouter 700`.

