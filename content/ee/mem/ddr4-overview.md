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

Command:
- WE_n: Write Enabled.
- CAS_n / RAS_n

Addressing:
- C0, C1, C2: select a layer in a 3DS design among up to 8 layers.
- BG0-BG1: select a bank group among up to 4 bank groups
- BA0-BG1: select a bank among up to 4 banks in a bank group
- CS_n: Chip Select. ALL inputs are ignored when this pin is HIGH.

    All chips on a DIMM shared the same CS_n. This allows memory controller in a multi rank setup to ... TODO

- A0-A16: address bus for both row and column address

Management:
- ODT: On Die Termination.

Data:
- DQ0-DQ7: bi-directional data bus for both read and write
- DQS_c / DQS_t: `DQ` strobe. A pair of differential ...
- TDQS_c / TDQS_t: Termination `DQ` Strobe.

Misc:
- CKE1 / CS1_n / ODT1: DDP only alternative to CKE ...
- DM_n: (input) data musk.
- DBI_n: data bus inversion.
- ZQ: reference voltage for ZQ-calibration
- TEN: Connectivity Test Mode Enable. TEN is required for x16 and optional for others. A x8 vendor may choose to ignore this pin.
- ACT_n:
- VREFCA: Reference voltage for CA.
- AP: Auto-precharge.
- BC_n: Burst Chop.
- RESET_n:
- ALERT_n:
- PAR: (Command and Address) Parity Input.


## Organization

### Bank & Bank Group

All DDR chips are organized into "banks".


DDR4 further organizes banks into *bank group*. `JESD79-4` requires that all DDR4:
- `x4` or `x8` chip has 4 bank groups of 4 banks each, i.e. 16 banks
- `x16` chip has 2 bank groups with 4 banks each, i.e. 8 banks.

Each bank has its own row of sense amplifier attached to its bitlines.

Bank is the unit of
- command handling. Each bank is able to handle a read ..., while rows from other banks can be read simultaneously.
- row open/close. Only one row can be opened per bank, but each bank can open its own row independently.


The purpose of such bank-based division is to that ...

## Registers

### Mode Registers


DDR4 provides 7 mode registers named from `MR0` to `MR6`, each can be think as a 14-bit struct with bit field.
They store parameters that determine runtime behavior of the SDRAM chip.

To write to a mode register, issue the one-off `MRS` (mode register set) command, which uses the encoding:
1. assert (lower) `RAS (A16)`, `CAS (A15)` and `WE (A14)`
2. `BG0 BA0 BA1` as register selection (with `BG1` must be 0 reserved for future). `000` means `MR0` and `110` means `MR6` etc.
3. `A0 - A13` as OPCODE (with `A17` must be 0 reserved for future)

There is no partial write, and an `MRS` always clobber all bits. It's memory controller's responsibility to keep the state.
Important time measures:
1. `t_MRD`: minimum time required between two MRS commands
2. `t_MOD`: the minimum time required from an MRS command to a non-MRS command (except a `DESELECT`)

#### `OPCODE` sematics by register

- MR0:
- 


### General Purpose Registers


## Chip Lifecycle

### `MR` default reset

A common subroutine that sets critical MRs is often used during setup and reset:

SUBROUTINE: MR default reset

| MR & pin   | value         | desc                          |
|------------|---------------|-------------------------------|
| MR3 A[3]   | 0 = 1/2 rate  | gear-down mode                |
| MR3 A[4]   | 0 = disable   | per-DRAM addressability       |
| MR4 A[1]   | 0 = disable   | maximum power-down            |
| MR4 A[8:6] | 000 = disable | CS to command/address latency |
| MR5 A[2:0] | 000 = disable | CA parity latency mode        |
| MR4 A[13]  | 0 = Disable   | Hard Post Package Repair mode |
| MR4 A[5]   | 0 = Disable   | Soft Post Package Repair mode |

