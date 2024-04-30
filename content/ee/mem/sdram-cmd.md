---
title: "SDRAM Chip Command & Encoding"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- memory
- sdram
---

### `NOP`: no op

### `REF`: REFRESH

### `DES`: deselect

### `ACTIVATE(BG, BA, A[17:0])`: open a row in a bank

encoding:

The `ACTIVATE` command is used to open (activate) a row in a particular bank for subsequent access.
One bank can only have 1 opened row at the same time.

timing restriction:
- `t_RRD_S` (s for short): minimal interval user must wait btwn 2 `ACTIVATE`s in different bank group.
- `t_RRD_L` (l for long): minimal interval user must wait btwn 2 `ACTIVATE`s in the same bank group.
- `t_FAW` (four ACTIVATE window): minimal interval user must wait between a first `ACTIVATE` and a fifth `ACTIVATE`, regardless of bank groups; in other words, a sliding window over time that can't contain 5 or more `ACTIVATE`.


### `PRECHARGE(BG,BA)`: close the currently opened row in a bank

encoding:

