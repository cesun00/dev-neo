---
title: "DDR4 Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

DDR4 chips comes in x4/8/16/32 configuration, indicating the width of `DQ` bus being 4/8/16/32 lines.

For pin named `XX_n`, LOW voltage (referred to as 0) means active/enable, and HIGH (referred as 1) means inactive/disabled.

The operation of a DDR SDRAM chip requires a LOW `CS_n` signal, otherwise all input will be ignored.
This allows multiple chips to use the same command / address bus (as in a memory module), while only the selected one is active.

All discuss below assume a LOW `CS_n`.

### acronyms

DDP: Dual Die Package    
TSV: Through-silicon via

#### Dual Die Packaging (DDP) a.k.a TwinDie

These chips have extra pins with suffix `1` defined; e.g. `ODT1`, `CS1_n`, since it contains 2 dies in the same package.

## Pin Assignment

x8 config defines the following pins:

powers:
- Vdd / Vss:  and its ground
- Vddq / Vssq: `DQ` bus power supply 1.2V and its ground
- Vpp: DRAM activating power supply 2.5V

Clock:
- `CK_t / CK_c`: a pair of differential clock input. All inputs to the chip will be sampled on the up edge of `CK_t` and down edge of `CK_c`.
- CKE: Clock Enabled.

