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

Extra setup are required before you can invoke `mysqld` or start its systemd service:

```bash
mysqld --initialize --user=mysql --basedir=/usr --datadir=/var/lib/mysql
```

Some notes:
- `--initialize` creates the `mysql` schema and generates a random initial password for `root@localhost` db account and print it to stderr. Use `--initialize-insecure` for no password.
- `--user` informs `mysqld` the user to `setuid` to. Without this flag, `mysqld` stays the current user, and it may find insufficient permission for data directories.
- `--basedir` specify the installation base. Archlinux AUR does a normal system-wide installation under `/usr`. `--datadir` specify the directory to put all database in. Both options can be specified in `my.cnf` as well.
- Such initialization does not overwrite any existing mysql schema tables, so it is safe to run in any circumstances. [ref](https://dev.mysql.com/doc/refman/8.0/en/data-directory-initialization.html)

## Data types

Integer: signed/unsigned integers 1, 2, 3, 4, and 8 bytes long, 

Floating point: FLOAT, DOUBLE, DECIMAL

Byte/Text string:
- in-place storage: CHAR, VARCHAR, BINARY, VARBINARY
- reference storage (take only 9 to 12 bytes in row): `[TINY|MEDIUM|LONG]TEXT`, `[TINY|MEDIUM|LONG]BLOB`

Datetime type: DATE, TIME, DATETIME, TIMESTAMP, YEAR

Special: SET, ENUM, and OpenGIS spatial types

### Numeric Type

M and D for `FLOAT` and `DOUBLE` are deprecated.

| name      | #bytes | (M)       | (D)       |
|-----------|--------|-----------|-----------|
| TINYINT   | 1      | DW        | /         |
| SMALLINT  | 2      | DW        | /         |
| MEDIUMINT | 3      | DW        | /         |
