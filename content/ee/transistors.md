---
title: "Memorandum: Transistors"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- transistor
---

> A transistor is just a variable resistor whose resistance is adjustable not by hand but by electricity.

A transistor is any device with 3 (or more - see below) terminals where the voltage (thus current) between one pair of terminals controls the current (thus effective resistance) flowing through another pair of terminals. This nice controllability allows a transistor to be used as a *switch* of current, turned on and off also by electricity.

Multiple implementations of the idea of the transistor exist, based on different physical rationales.

1. bipolar junction transistor (BJT)

    The 3 terminals of an BJT are named *base, collector and emitter*.

    A small current at the base terminal, flowing between the base and the emitter, can control or switch a much larger current between the collector and emitter.

2. field-effect transistor (FET)

    FET, a.k.a unipolar transistor, is a division of transistors that only use 1 type of charge carrier (either electron or hole).

    3 termianls of an FET is named *gate, source and drain*.
    A voltage at the gate can control a current between source and drain
    
    Sub-division of FET includes:
    1. MOS-FET (metal-oxide-semiconductor FET)
    2. 


## BJT


A BJT is made by sandwiching 3 layers of 2 types of doped semiconducting material:

Depending on how the sandwitch is made, 2 types of BJT exist:
1. NPN
2. PNP

Regardlessly, these 3 regions are called `collector`, `base`, and `emitter`, thus also the electrode to them.
- `base` is in the middle, and is always the one with different `N/P type`.

A small current flowing between `base` and `emitter` (abbr. `I_B`) can control or switch a much larger current between the `collector` and `emitter` (abbr. `I_C`).

- `emitter output current = I_B + I_C`

- The `base-emitter / collector-emitter` ratio is a critical characteristic for a transistor, usually symbol `β` or `H_fe`.
- the I-V curve of `base-emitter` path behaves like a simple diode. This fact is useful when sending signal input to base and use the transistor as an amplifier, you want the base's I/V curve to behave like a straight line, which determine the range the AC signal can swing.
   but in real life the collector one is more than 80 times larger than the base one, so we often ignore the base current's contribution to the output.

- For a given steup, we care about the `base current / collector current` ratio, usually denoted `β` or `H_fe`.

   This ratio is almost constant when the transistor is working in the *active region*.
   
   This ratio is important, because for a given known `I_B` and enough external voltage supply, `I_C` can be simply calculated as `I_C = β * I_B`.

For a fixed base current, `V_RC / I_C`


## FET

1. gate
2. source
3. drain

## Complementary metal–oxide–semiconductor (CMOS)

### MOSFET


## `I/V` curve of collector-emitter (parameterized by `I_B`)


