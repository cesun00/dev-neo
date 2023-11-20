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
| INT       | 4      | DW        | /         |
| BITINT    | 8      | DW        | /         |
| DECIMAL   | TODO   | precision | scale     |
| FLOAT     | 4      | DON'T USE | DON'T USE |
| DOUBLE    | 8      | DON'T USE | DON'T USE |
| BIT       |        | # of bit  | /         |

*DW stands for "display width". Application can retrieve this value in the column description, thus decide how to display the number. Whether use it is application's choice. It does not constrain the storage range in any sense.*

- `Boolean` is alias for `TINYINT(1)`
- `Integer` for `INT`
- `NUMERIC` for `DECIMAL`
- `REAL` and `DOUBLE PRECISION` for `DOUBLE`

### Byte/Text String Type

Unit of `(M)` is byte, meaning that one chinese character in utf8mb4 requires at least `CHAR(3)`, i.e. charset sensitive.

Byte string differs from text string in that all byte string are of charset `binary` and collation `binary`; padding is also different.

| name         | description                 | (M)                                                      | if content length < capacity                        |
|--------------|-----------------------------|----------------------------------------------------------|-----------------------------------------------------|
| CHAR(M)      | fixed-length string         | fixed # of BYTE (0 to 255)                               | right padded with SP (but trimed when retrieved)    |
| VARCHAR(M)   | variable-length string      | the maximum column length in **characters** (0 to 65535) | won't charge unused storage.                        |
| BINARY(M)    | fixed-length byte string    | same as CHAR(M) (0 to 255)                               | right padded with 0x00 (NOT removed when retrieved) |
| VARBINARY(M) | variable-length byte string | same as VARCHAR(M)                                       | won't charge unused storage.                        |



### Time/Date Type

TODO


## expressions
