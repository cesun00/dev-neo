---
title: "Memo: What Every Programmer Should Know About Memory"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- memory
---

This is a memo for Ulrich Drepper's *What Every Programmer Should Know About Memory*

https://people.freebsd.org/~lstewart/articles/cpumemory.pdf

Naming
------------
Unit: 
- GT/s: gigatransfer per seconds, i.e. billion or 10^9
- MT/s: megatransfer per seconds, i.e. million or 10^6

DDR4-2666 means a DDR4 SDRAM chip is around 2666.67 MT/s.

Most commercial MM mounts 8 x8 chips per rank in order to provide a 64 bit global data bus. If the chip mounted is DDR4-2666, the whole module is named PC4-21300, because each transfer is 64 bits = 8 bytes, and 2666.67 * 8 = 21333.36 MB/s.

DDR4 SDRAM spec JESD79-4 further divide chips of the same frequency into speed bin:

```
Speed Bin	DDR4-2666T	DDR4-2666U	DDR4-2666V	DDR4-2666W
CL-nRCD-nRP	17-17-17	18-18-18	19-19-19	20-20-20
...
```

The last letter refers to performance, and the same letter means the same CL-nRCD-nRP even if the frequency is different.

Northbridge & FSB
--------

Before Intel Sandy Bridge and AMD APU (both in Jan 2011), northbridge was a standalone chip on the motherboard. After that all functions of the northbridge were integrated into CPU, so no northbridge anymore. And the corresponding southbridge was renamed to Platform Controller Hub by Intel, and Fusion Controller Hub by AMD.

Northbridge talks directly to CPUs by attaching to FSB. FSB was the bus among CPU cores and memory controller. It is replaced by AMD HyperTransport / Intel QuickPath Interconnect in modern CPU.

Among other hardware circuitry, NorthBridge contains the memory controller.

Memory Controller
----------

Memory controller is a component between the CPU cores and the RAM. It's either in the northbridge (when nb was still there) or integrated into the processor (integrated memory controller (IMC)).

MC is responsible for:
1. providing clock for SDRAM;
2. translating all memory read/write issued from CPU into pin signals like `^RAS`, `^CAS`, and precharge, etc;
3. issuing refresh commands for SDRAM. SDRAM refresh is not transparent, and MC needs to control it. JEDEC requires DDRn SDRAM to be refreshed every 64 ms.

DDR4 SDRAM Architecture
---------

### Rank

A memory rank is a set of DRAM chips connected to the same chip select (`CS_n`), which are therefore active/inactive simultaneously. In practice all DRAM chips share all of the other command and control signals, and only the chip select pins for each rank are separate (the data pins are shared across ranks).

This means that all chips on the same MM share the same command lines. Chips is told to accept the current command signals only when `CS_n` is on, and all chips in the same rank accept the same commands.

Memory controller is fully responsibly for rank selection. MM PCB only wires those pin.

### Addressing & Word

### Bank and Bank Group

DDR4 added a new feature called "bank group". JESD79-4 requires tha each x4 or x8 component has 4 bank groups of 4 banks each, i.e. 16 banks; and x16 component has 2 bank groups with 4 banks each, i.e. 8 banks.

For example, `HyperX HX436C17FB3/8` has 4 bank groups of 4 banks each, i.e. totally 16 banks.

Each bank has its own 

Bank is the unit of command handling. Each bank is able to handle a read ..., while rows from other banks can be read simultaneously.

Bank is the unit of row open/close. Only one row can be opened per bank, but each bank can open its own row independently.

Each bank has its own row of sense amplifier attached to its bitlines.

The purpose of such bank-based division is to that

### Prefetch


### Read/Write Burst

### Activation (open a row) and Precharge (close a row)

Upon receiving ^RAS, it takes `t_RAS` clock cycles 

### Clock

In early days when CPU was not that fast, 

### Refresh

Capacitors in DRAM is leaking all the time, and needs to be charge (refresh) constantly to keep the bits alive. Charging is done by simply activating a row.

The unit of refreshing is cell row.

DDR4 UDIMM Details
-------------

Standard: 4.20.26 of JESD21-C Release 29.

The whole 288 pins of DDR4 UDIMM **is alwaus fully used regardless of how many ranks the system has**. It has exactly 17 address lines from `A0` to `A16`, and x4 component is not allowed meaning that `A17` is never a thing. It has exactly 64 DQ lines, wired to the 8 chips per rank, meaning that parallel access to both rank is impossible. 

TODO: max # of bank. Are CS0_n CS1_n 2-4 decoded?

TODO: address and command lines wiring.

Port vs Channel
-------


