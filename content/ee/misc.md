---
title: "Memory Chip MISC"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Data Strobe Encoding

To transmit binary bit sequence in a synchronous circuit, one can use a single serial line `data`, e.g. sampled at the up edge of clock.
Data strobe encoding does the same with an extra line `strobe`, and provide jitter tolerance and clock recovery.
- `data` as before is trasmitted as-is. 
- Level of `strobe` is flipped only if 2 consecutive data bits are the same.

consequence:
- `data` can be verified by looking at `strobe`
- `data XOR strobe` recovers the clock square wave

## Surface-mount technology (SMT)

The technique to install chips on the surface of a PCB, instead of the old way (known as *through-hole technology*) of penetrating the PCB for holes with metal contacts.

## Ball grid array (BGA)

## Signal naming

Active-low signal (i.e. low voltage is considered active) is usually noted as:
1. a bar above `^CAS`
2. a prefix or suffix `_n`: `CS_n`

## High-z gate / bus

## signal interface

- TTL (transistor-transistor logics):
  
  1. operates from +5V or 3.3V power supply
  2. `1` represented by voltage between 2.4 V and 5 V (i.e. VCC), must be more than 2V
  3. `0` represented by voltage between 0V and 0.8V, must be less than 0.8V

- LVTTL (Low Voltage TTL): 
- SSTL_2 (Stub Series Terminated Logic for 2.5 volt)

  2.5 V, defined in `EIA/JESD8-9B 2002` used in DDR among other things.

- SSTL_3

  3.3 V, defined in `EIA/JESD8-8 1996`

- SSTL_18

  1.8 V, defined in `EIA/JESD8-15A`, used in DDR2 among other things.

- SSTL_15, 1.5 V, used in DDR3 among other things.
