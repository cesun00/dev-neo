---
title: "SDRAM Memory Modules"
date: 2024-01-01
lastmod: 2024-05-01
draft: false

---

### Memory module

The name of a MM spec is usually like `DDR4 (SDRAM) DIMM` with `PC4-12800` or `PC4-2133`.

1. DDR (Double Data Rate) means that the `DQ` lines of **each chip** are double pumped; 4th generation of this technology.
2. SDRAM means *synchronous dynamic RAM*, and is usually omitted since it's the default since 1990.
3. DIMM (Dual In-line Memory Module) refers to the fact that the PCB has 2 rows of distinct pins on both side of the PCB.
   1. DIMM became popular in late 1990s, and is now the standard for **desktop** memory module.
   2. Before DIMM was the SIMM (Single In-line Memory Module), used from 1980s to 1990s. A typical SIMM has 72 pins on both side of the PCB, but signals are the same for each pin pair on different side, thus effectively a "single" row of 72 pins, or "redundant".

- DIMM
	- Registered (i.e. buffered) DIMM (RDIMM): Can be distinguished by a buffer chip in the center of the PCB.
	- Unregistered (i.e. unbuffered) DIMM (UDIMM):
- SO-DIMM (Small Outline DIMM) is the standard for laptop MM.

The details (shape, # of pins, position of notch, protocol) of each spec can differ very much, and none of them is forward/backward compatible.

For example, `DDR3 DIMM` has 240 pins, but `DDR4 DIMM` has 288; `DDR3 SO-DIMM` has 204, but `DDR4 SO-DIMM` has 260. DIMM or SO-DIMM alone just means DI and nothing else.

## memory chips

Common number of chips found on DIMM/SO-DIMM is 8, or 9 (the added one for ECC), while new DIMM sometimes has 16 or 18 chips (the added 2 for ECC).

Each chip has a certain capacity of bits.
`JESD79-4` requires a DDR4 SDRAM chip to be one of 2/4/8/16 Gibits.
