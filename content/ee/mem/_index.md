---
title: "Computer Memory"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

A *memory module* is a PCB with several memory chips mounted. It is the unit of commercial distribution.

JEDEC is the organization that standardizes MM PCB as well as the mounted chips.([Example: specs of all DDR4 MM.](https://www.jedec.org/standards-documents/focus/memory-module-designs-dimms/DDR4/all)).

Each memory chip is called a *SDRAM component* by JEDEC's speak.

## JEDEC

JEDEC is the standard maker in memory industry consists of more than 300 companies. It's divided committees numbered like `JC-XX`, each responsible for a topic. A committee may be dismissed after it finished its work, e.g. `JC-25`  published tansistor standards but doesn't exist any more. [list of all current active committees and their jobs](https://www.jedec.org/committees)

JEDEC standard's title consists of a letters prefix for document type, and a self incremental number (though gap exists for abandoned ones), e.g. in `JESD79-4B`, `JESD` means "JEDEC standard", `79` is the index for all `DDR` SDRAM stds, and `4` indicates `DDR4`, and `B` is the revision number.

https://www.jedec.org/standards-documents/facet/document-types

## Comparison of Generations

sdr:
- single data rate: `DQ` transfers (i.e. get rewritten) a cell at each `CLK` up edge
- pipelined (unbuffered): each `READ` fetch `BL` cells, to transfer a cell means writting DQ once.

ddr1:
- double data rate: `DQ` transfers (i.e. get rewritten) a cell at both `CLK` up and down edges
- 2n-prefetch (2n buffered): , i.e. to transfer a cell means writting DQ twice.

ddr2:
- double data rate: transfer a cell (i.e. rewrite `DQ`) at both `CLK` up and down edges
- 4n-prefetch (4n buffered):

Using prefetch / larger prefetch buffer doesn't directly make the chip faster (i.e. make number-of-transfer-per-clock larger), 
but is necessary in order to design chip with higher `CLK` rate.

|      | CLK freq  | cell transfer freq | DQ write frequency | bits rate (for x8 device) |     |
|------|-----------|--------------------|--------------------|---------------------------|-----|
| SDR  | 133 MHz/s | 133M cells/s       | 133M transfer/s    | 1066 Mbits/s              |     |
| DDR1 | 133 MHz/s | 266M cells/s       | 533 M transfer/s   | 4200 Mbits/s              |     |
| DDR2 | 133 MHz/s | 266M cells/s       | 1066 M transfer/s  | 8500 Mbits/s              |     |
| DDR3 | 133 MHz/s |                    |                    |                           |     |
| DDR4 | 133 MHz/s |                    |                    |                           |     |
| DDR5 | 133 MHz/s |                    |                    |                           | --> |


## Configuration


A SDRAM chip of given bit capacity can come in the form of different *configurations*, differed by their *width* and *number of cells*, 
as long as the product of these 2 numbers is the same.

For all SDARM chip, these quantities ALWAYS equal:
1. its width, usually 4/8/16, denoted `x4`/`x8`/`x16`
2. number of bits stored per cell (per column location in a row)
3. number of its `DQ` lines.

e.g. An 1 Gigabits chip may comes 3 flavor:

| cell count | width | bank count |
|------------|-------|------------|
| 32 Meg     | x4    | 4          |
| 16 Meg     | x8    | 4          |
| 8 Meg      | x16   | 4          |

where 1 `Meg` is 1024*1024 cells.

## Bank

A SDRAM chip is internally organized as banks. Each bank is a plane matrix of some number of rows and columns.
Each cell holds its width number of bits.

For example, `micron MT48LC16M8A2` is a x8 chip which has 4 banks of 4096 rows x 1024 columns each.

The purpose of the bank division is to allow accessing other banks while a given bank is prechraging (thus must wait `t_RP`).
A smart user should be able to distribute data into different banks s.t. `PRECHARGE` punishment in a bank can be hide by accessing other banks.

Each bank can only have 1 `ACTIVATE`d row. It's an error to `ACTIVATE` a second row before `PRECHARGE` a first one.

## Common Pins

A suffix `_n` or `#` indicate a low-active pin.

| symbol         | name                  | type           | desc                                                                                                                                                                                                                          |
|----------------|-----------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Vdd`          | chip power            | power          | chip basic power supply                                                                                                                                                                                                       |
| `Vss`          | chip ground           | power          |                                                                                                                                                                                                                               |
| `Vddq`         | DQ power              | power          | `DQ` uses isolated power and ground for improved noise immunity.                                                                                                                                                              |
| `Vssq`         | DQ ground             | power          |                                                                                                                                                                                                                               |
| `Vpp`          | DRAM power            | power          |                                                                                                                                                                                                                               |
| `CLK` / `CK_t` | clock (true)          | clock input    | the classic clock the whole system samples at whose up edge.                                                                                                                                                                  |
| `CK_c`         | clock (complement)    | clock input    | differential clock to `CK_t`                                                                                                                                                                                                  |
| `CKE`          | clock enabled         | flag input     | HIGH active. Assert/Deassert to exit/enter power saving/down mode.                                                                                                                                                            |
| `CS#`          | chip select           | flag input     | LOW active. Deasserting it makes ALL command input ignored.                                                                                                                                                                   |
| `RAS#`         | row address select    | flag input     | LOW active.                                                                                                                                                                                                                   |
| `CAS#`         | column address select | flag input     | LOW active.                                                                                                                                                                                                                   |
| `WE#`          | write enabled         | flag input     | LOW active.                                                                                                                                                                                                                   |
| `DQ[0:??]`     | data IO (I+O=Q)       | input & output |                                                                                                                                                                                                                               |
| `DQM` / `DQMH` | DQ mask (high)        | flag input     | HIGH active. The same pin is known as `DQMH` to diff from `DQML` when present. Asserting it, after some delay, 1)always masks the input DQ for a `WRITE` command; 2) on some chip also makes `DQ` high-z for a `READ` command |
| `DQML`         | DQM mask low          | flag input     | HIGH active. For chip with wider `DQ`, `DQMH` controls `DQ[higher half]`, and `DQML` controls `DQ[lower half]`                                                                                                                |
| `BA[0:1]`      | bank address          | addr input     |                                                                                                                                                                                                                               |
| `A[0:??]`      | address bus           | addr input     |                                                                                                                                                                                                                               |

## Common Command & Post Command time restriction


### `ACTIVATE(bank, row address)` (or `ACTIVE` in old SDR spec)

- `t_RCD`: minimal interval user must wait btwn `ACTIVATE` and later `READ` or `WRITE` on that row.
- `t_RC`: minimal interval user must wait btwn 2 `ACTIVATE` in the same bank.
- `t_RDD` minimal interval user must wait btwn 2 `ACTIVATE` across all bank, usually small.

### `PRECHARGE(bank)` / `PRECHARGE_ALL()`

- `t_RP`: minimal interval user must wait btwn a `precharge` and any non-NOP command in the same bank.

### `READ`: start read burst, or one-off read then precharge

`# of row > # of column`, so a `READ` or `WRITE` will not use all the address lines.
An unused higher bit of `A[]` bus will be used to indicate whether this is a auto-precharge read / write.

- `CL (CAS Latency)`:


### `WRITE`: start write burst, or one-off write then precharge

### `REFRESH` / `AUTO REFRESH` / self refresh mode

Auto means chip maintain the self-incrementing address counter, thus user doesn't need to specify the address.

## Burst

All modern SDRAM chip performs read / write in a *burst* manner, parameterized by an `BL` value configurable via the mode register.
Each row in a bank is logically divided into `BL`-sized blocks. 

A `READ` command selecting a specific cell effectively selects the block that cell is in.
Instead of only outputing the request cell, the content of all cells in that block will be made available on `DQ` one after one, in either `Sequential` or `Interleaved` order determined by the `burst type` field in the mode register.

Common value of `BL` is 2/4/8.
- When `BL=1`, a burst read effectively decay to a single cell read. Depending on the chip, `BL=1` may be not supported.
- `SDR` and `DDR1` supports `BL=FULLPAGE`, a special enum that continuously output all cells in a row, until a `BURST TERMINATE` command is entered.
- support `BL` of larger length isn't really useful, as it also increase the chance of giving user unwanted data willy nilly.