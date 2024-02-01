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
