---
title: "A Simple Electric Physics Primer"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## resistor / resistance & conductance

- *resistance* measures an object's opposition to the flow of current through it.
- *conductance* is the reciprocal of resistance. (unit: `mho ℧`)

The electrical component that provides resistance is called a *resistor*.

## inductor / inductance

When the current (strength) through an object changes (e.g. in an AC circuit), *inductance* measures the object's ability to oppose such change.
Unit of inductance is `henry (H)`. Customary symbol for inductance is `L`.

The electrical component that provides resistance is called an *inductor*.
Inductors are made by winding insulated wire into a coil, optionally wrapping around a *magnetic core* (i.e. a magnet field waveguide, usually an iron or ferrite cylinder).

The ultimate reason of inductor to oppose the change of current, is its coiling structure being sensitive to change of magnetic flux due to the change of current strength.
An EMF is generated to alleviate the change of magnetic flux, governed by the Lenz's law, which is opposite to the change of current in the first place.

 through the circuit, governed by the Faraday's law of induction.

- From high level, inductor can be seen as an component that stores energy in magnetic field  when ... TODO
- In DC circuit the current is constant, thus an inductor provides no inductance, and behaves like a wire (perhaps with only resistance).

## capacitor / capacitance

*Capacitance* measures an object's ability to accommodate charges.
It takes more charges (thus, more charging time) for a high capacitance object to reach electrostatic equilibrium when attached to a cathode / anode.

When 2 objects have different net charge, electric potential drops from the positive one to the negative one, i.e. voltage exists.
- For 2 point charges, the E-field along their connecting line is of strength
- In real world there is no point charge, instead charges are evenly distributed on the surface of these 2 objects (under the assumption of their being good conductors thus electrostatic equilibrium forms instantaneously).

## reactance (电抗)

## impedance (阻抗)

## resistivity

Unit: Ohm per meter (Ω⋅m)

## P/N rationale

All semiconductors revolves around 2 types of semiconducting material: `P` (from positive) and `N` (from negative) type semiconductor.

Both `N` and `P` are made by lacing impurities atoms into pure semiconductor (e.g. sillicon), a technique known as *doping*:
- `N` uses impurities that provides mobile electrons (such as phosphorus or arsenic) 
- `P` uses impurities that provide holes that readily accept electrons (such as boron)

Note that both `N` and `P` are electrically neutral.
But when `N` and `P` are attached, `P` begins to suck electrons through their junction surface. 
This forms an electrical unbalanced area near the junction surface known as the *depletion region*, where the `P` side is negatively charged with more electrons, while `N` side is positively charged with holes:

![](./depletion_region.png)

This phenomenon has significant consequences. Under an external voltage:
1. it's trivial to move electrons from `N` to `P`, as if the whole device is a conductor.
2. it's hard to move electrons from `P` to `N`, since that voltage must be large enough to power electrons to get over the electron aggregation on `P` side.
   - when that voltage is indeed large enough, it is known as as *breakdown*. Depending on the component, a breakdown might be desired and by design. (See zener diode.)

This structure of single-direction condutivity is the basis of all semiconductor component.

## electron hole

The absence of 1 or 2 electron in an ion can be equivalently viewed as imaginary positive-charged particle at the location of the absense electron. A hole is a quasiparticle, i.e. doesn't really exists, but just a math illusion for convenience of physical computation.


## Diode

An ideal diode is 2 terminal device that only allows current flow in one direction:
1. toward one direction it behaves like a wire: no resistance
2. towrad the other direction it behaves like an insulator: infinitely large resistance

In real engineering:
1. for forward cururent, diode consumes a little bit voltage (about 0.6 volt) before its resistance is negligable low
2. for backward current:
   1. before breakdown: a tiny leakage current exists like any insulator
   2. after breakdown: low resistance and fixed voltage like any brokedown insulator

### Zener Diode

Zener diode is a diode with known and reliable breakdown voltage. It normally and intentionally works in breakdown, so that the voltage between its 2 termianls is always fixed (i.e.the known breakage voltage).

When any insulator gets electrical brokedown, its resistance becomes very low (i.e. the `I/V` slope is very high), at the price of given high enough voltage.
But this doesn't mean it consume no voltage. Rather, it obtains large current with that voltage (and you can't decrease the volt for free!), such that increasing the voltage becomes very hard since that will doubly increase the power `P = IV = V^2 / R` and you have a external power source with fixed power output.

When a diode breakdown, it's still able to create a electric potential drop.

### Photo Diode

When photon hits the depletion area ...

A photo diode work in breakdown mode:
- For forward current: identical to normal diode
- For backward current: the breakdown voltage decrease when light hits its surface.

The photocurrent decreases as the surface area of the PIN material increase.

### Light Emitting Diode (LED)

An LED work in forward mode:
- For forward current: like normal diode, but the voltage drop is larger.

   The extra voltage provide more power which become photon emitted. The shorter wavelength, the larger that setup voltage consumption is.

- For backward current: identical to normal diode

### Variable capacitor

### Schottky Diode

## triode

## Kirchhoff's current law (KCL)

For any node (junction) in an electrical circuit, the sum of currents flowing into that node is equal to the sum of currents flowing out of that node.

KCL equality is about instant moment (since - like speed - current is a per-second measurement), but hold for every moments in an active circuit.

## Thévenin's theorem

