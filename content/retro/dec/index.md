---
title: "DEC & PDP Computer History"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

DEC Modules
==============

## 1st gen: Laboratory Module (early 1958)

The Laboratory Module is DEC's first revenue-generating product line.
They are basic logical circuit components (like AND gates or a flip-flop) encapsulated in a metal box.
These boxes were intended to sit on a workbench or be installed into rack chassis and mounted in a 19-inch rack, interconnected with banana plugs and jump wires.

width:height:depth = `1-3/4 : 4-1/2 : 7` inches in size

three speed ranges were 5 MHz (1957), 500 kHz (1959), and 10 MHz (1960).



<!-- 
the installatoin of 9 modules in a 3U row of a 19-inch rack.


Most DLM are synchronized digital circuit where a clock must be provided.
(DEC also had a clock generator module.) These modules usually 
comes in 500 kilocycle, 5 megacycle and 10 megacycle versions for users to choose from. -->

## 2nd gen: System Module (System Building Blocks)

DEC's second product line is the System Building Blocks, which were re-branded as the *System Module*
in 1961.
Their internal circuits were identical to the Laboratory Modules but used a more compact package.
Instead of using a banana plug interface in the front, System Modules has 22 gold-plated discrete pins (the Amphenol 143-22-01 connector) in the backside. System Modules are meant to be plugged into a [wire-wrapped](https://en.wikipedia.org/wiki/Wire_wrap) *backplane*.

> The term backplane back in the 1960s simply refer to an insulated mounting board instead of a PCB in nowadays'sense. Such backplanes had no trace but only punched holes for the fixation of equipment.
Connectivity is established by wire-wrapping in the backside of the board, leaving a clean
and tidy front view of the equipment. Such wire-wrapped backplane exists from PDP-1 to PDP-7,
also in `PDP-8` (1965), `PDP-8/S` (1966), `PDP-8/I` and `PDP-8/L` (1968), `PDP-12` (1969), 
and was finally replaced by the OMNIBUS system bus in `PDP-8/E` (1970).

System Modules were used to bulid PDP-1 to PDP-7, though PDP-7 used some FLIP CHIPs as well.


https://en.wikipedia.org/wiki/Digital_Equipment_Corporation#/media/File:Dec_SYSTEM_BUILDING_BLOCKS_1103.jpg

`System Building Blocks` was printed on the edge https://gunkies.org/wiki/File:PDP-6_mod_end.jpg

To use such card-shaped modules, one need to plug them into a backplane which could be mounted in a 19-inch rack.
The backplanes allowed 25 modules 

> a backplane
>
> If you plug 20 modules into a backplane, the first pin of all modules is connected, so is the second pin, etc.
> This forming multiple computer buses, one for each pin position.

## 3rd gen: FLIP CHIP

FLIP CHIP was designed in 1964 as components of and enhancement to the PDP–7 computer.

- The `R series` which operates from DC to 2 Megahertz.
- The `B series` which operates from DC to 10 Megahertz.
- The `W series` modules for interfacing with various types of external equipment

- 4000-Series: the second series, nominally 500 KHz, but some 1 MHz
- 1000-Series: the original series, nominally 5 MHz
- 6000-Series: higher speeds, nominally 10 Mhz
- 8000-Series: very high speeds, nominally 30MHz


## The reference manul

The official manual of DLM and System Module was the *Digital Logic Handbook*.
The first edition was released in September 1960.
Some of them are available at the [bitsavers](https://bitsavers.org/pdf/dec/handbooks/)


PDP-1
========

Digital used their existing line of logic modules to build a PDP
and aimed it at a market that could not afford the GIGANTIC computers.

Such "existing line of logic modules"

The stock installation of PDP-1 is simply 4 19-inch racks.
Everything else, e.g. the keyboard, the printer, and [the iconic circle CRT display](https://www.soemtron.org/pdp7optionslist.html#opt30) is considered peripheral devices.

There were totally 53 PDP-1 built and delivered, from the first in 1959 to the last one in 1969.

An average configuration cost $120,000 at a time "when most computer systems sold for a million dollars or more."

PDP-7
===========


In contrast to previous mainframes which require special condition like a climate-controlled room,
PDP-7 is completely self-contained, requiring no special power sources, air conditioning, or floor bracing. 

An installed PDP-7 use a single source of 115-volt, 60-cycle, single-phase power. 
the PDP-7 produces circuit operating DC voltages of -15 volts (±1) and +10 volts (±1) which are varied
for marginal checking. Total power consumption is 2000 watts.

PDP-7 used 18-bit words. It used magnetic core memory, which is 4096 words in size.
6 registers:

| name                            |                                                                                                                                                                               |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AC` -  ACCUMULATOR             | 18-bit register which performs arithmetic and logical operations on the data and acts as a transfer register through which data  asses to and from the I/O bu Her reg i sters |
| `L`  -  LINK                    | 1-bit register used to extend the arithmetic facility of the accumulator.                                                                                                     |
| `MA` -  MEMORY ADDRESS REGISTER | 13-bit register which holds the address of the core memory cell currently being used.                                                                                         |
| `MB` -  MEMORY BUFFER REGISTER  | 18-bit register which acts as a buffer for all information sent to or received from memory.                                                                                   |
| `IR` -  INSTRUCTION REGISTER    | 4-bit register which holds the operation code of the program instruction currently being performed.                                                                           |
| `PC` -  PROGRAM COUNTER         | 13-bit register which holds the address of the next memory cell from which an instruction is to be taken.                                                                     |

A basic PDP-7 includes:

- Multiplexed IO controller
- IO devices:
    - a punched paper tape reader works at 300 cps (characters per second).
    - a paper tape punch works at 63.3 cps.
    - a KSR 33 teleprinter works at 10 cps.

Beyond this basic stock setup, user can optionally connect DEC modules. like a magnetic tape equipment.

## memory

coincident-current core

cycle time = 1.75 µs

In one cycle the memory control retrieves a single word from in the memory cell specified by the `MA` register into the `MB` register,

Apparently a basic PDP–7 system could consist solely of 
a type KA77A processor, 
149 core memory stack and
 a type KA71A I/O package 
 
 and cost $45,000 in 1965


DEC TYPE LIST
=============

- `TYPE 1xxx` are

TYPE 1501
TYPE 1502
TYPE 1703