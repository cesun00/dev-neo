---
title: "MySQL Charset and Collation"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- SQL
- mysql
- database
---

Character Set (charset) and Collations
----------------------

https://dev.mysql.com/doc/refman/8.0/en/charset-general.html

Mind the terminology abuse: "character set" or "charset" here is actually "encoding" in common sense.
e.g. `utf8` is said to be a charset here in MySQL, but in unicode terms "Unicode" is a charset and "utf8" is a encoding of Unicode.

- A character set is a set of characters, while a collation is the rules for comparing and sorting a particular character set.
- A character set can have many collations associated with it, while each collation is only associated with one character set.
- Charset and collation are inherited in a cascading style, granularities are: server, schema, table, column, string literal.
	- e.g. table level charset and collation, if not specified, will inherits those from schema level, etc.
- Charset and collation for all binary string (`BINARY`/`VARBINARY`/`BLOB` etc.) are `binary`.

The character set name is always prefix of the collation name. e.g. charset `big5` has a collation named `big5_chinese_ci`.
For more convention on collation naming: https://dev.mysql.com/doc/refman/8.0/en/charset-collation-names.html

Each character set also has one default collation.
When changing a character set and not specifying a collation, the default collation for the new character set is always used.
- `SHOW CHARACTER SET` (equiv. `SHOW CHARSET`) displays all supported charset and their respective default collation.
- `SHOW COLLATION` displays all supported collation and the charset with which they must be used.

*`SHOW` is not an SQL standard statement, and are being deprecated.
Both command retrieve information from the schema `information_schema`, and there exists equivalent `SELECT`.*

Note that multiple languages might be represented in the same charset (as we have a versatile `utf8mb4` for all languages in the world), but their collations differ:

```sql
SHOW COLLATION LIKE 'utf8mb4%';
# +----------------------------+---------+-----+---------+----------+---------+---------------+
# | Collation                  | Charset | Id  | Default | Compiled | Sortlen | Pad_attribute |
# +----------------------------+---------+-----+---------+----------+---------+---------------+
# | utf8mb4_0900_ai_ci         | utf8mb4 | 255 | Yes     | Yes      |       0 | NO PAD        |
# | utf8mb4_turkish_ci         | utf8mb4 | 233 |         | Yes      |       8 | PAD SPACE     |
# ......
# | utf8mb4_vi_0900_ai_ci      | utf8mb4 | 277 |         | Yes      |       0 | NO PAD        |
# | utf8mb4_vi_0900_as_cs      | utf8mb4 | 300 |         | Yes      |       0 | NO PAD        |
# | utf8mb4_zh_0900_as_cs      | utf8mb4 | 308 |         | Yes      |       0 | NO PAD        |
# +----------------------------+---------+-----+---------+----------+---------+---------------+
# 75 rows in set (0.00 sec)
```

### Configuration by Granularity

#### The Ultimate Fallback

A pair of default charset and collation should be specified on the `cmake` command line.
For installation from Archlinux AUR, this is:

```bash
grep -e 'DEFAULT_CHARSET' -e 'DEFAULT_COLLATION' PKGBUILD 
#    -DDEFAULT_CHARSET=utf8mb4 \
#    -DDEFAULT_COLLATION=utf8mb4_unicode_ci \
```

If nothing is provided on build at all, `utf8mb4 + utf8mb4_0900_ai_ci` are hardcoded:
https://github.com/mysql/mysql-server/blob/8.0/cmake/character_sets.cmake

```cmake
IF(NOT DEFAULT_CHARSET)
  SET(DEFAULT_CHARSET "utf8mb4")
ENDIF()

