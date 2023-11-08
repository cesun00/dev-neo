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

