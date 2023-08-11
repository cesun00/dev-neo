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
`MM total capacity = # of chips (excluding ECC ones) * capacity per chip`

Depends on the design of the memory module, all the following are possible:
1. one side of the MM contains all 8/9 chips;
2. one side of the MM contains all 16/18 chips;
3. each side of the MM has 8/9 chips.

For example, 
- Kingston HyperX `HX436C17FB3/8` is a 8 GiB DIMM with 8 chips of size 1 GiB each, 
- while `HX426C16FB3/32` is a 32 GiB DIMM with 16 chips of size 2 GiB each, mounted on both sides of the PCB.

### Parameters

All interval / delay has unit in clock cycle count:

- `t_RCD`: RAS to CAS Delay. The minimal interval between and `RAS + Row Addr` and a later `CAS + Col Addr`
- `CL`: CAS Latency. The delay after an `CAS + Col addr` and the actual data is available on `DQ`
- `t_RAS`: the minimal interval between a previous `RAS` and a later precharge for new row.
- 

```
CL(IDD) 			17 cycles
Row Cycle Time (tRCmin) 			45.75ns(min.)
Refresh to Active/Refresh Command Time (tRFCmin) 			350ns (min.)
Row Active Time (tRASmin) 			32ns(min.)
UL Rating					94 V - 0
```

### Pin Layout

### Multiport RAM

### Multichannel RAM

### Multi-banking

### Ranks
