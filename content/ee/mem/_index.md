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
