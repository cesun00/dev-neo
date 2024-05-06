---
title: "DEC & PDP Computer History"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

DEC Modules
==============

## 1st gen: Laboratory Module (early 1958)

{{<columns>}}

![](./labmod_handbook.png)

<--->

![](./dec_labmod_3xxx_chassis_x2.jpg)

{{</columns>}}

The Laboratory Module is DEC's first revenue-generating product line.
They are PCB of basic logical circuits (like AND gates or a flip-flop) encapsulated in a metal box
which expose banana plugs interface.
Laboratory Module were meant to be settled on an engineer's desk,
although rack-mounting chassis were also being sold which allows 
the installatoin of 9 modules in a 3U row of a 19-inch rack.

Most DLM are synchronized digital circuit where a clock must be provided.
(DEC also had a clock generator module.) These modules usually 
comes in 500 kilocycle, 5 megacycle and 10 megacycle versions for users to choose from.



[(credit)](https://www.computerhistory.org/pdp-1/2c53b69782533335f57f15695321fa8b/)
## 2nd gen: System Module (System Building Blocks)

DEC's second product line is the System Building Blocks, which are rebranded as *System Module* c. 1961. They are internally identical to DLM, i.e. basic digital circuit components, but use a different, compact package. The banana plug interface is replaced with 22 gold-plated discrete pins along one edge, a standard connector type designed by Amphenol. (this company still exist as of 2024.)

System Modules are used to bulid PDP-1 to PDP-7, though PDP-7 used some FLIP CHIPs as well.


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

The R series which operates from DC to Two Megahertz.
2. The B series which operates from DC to Ten Megahertz.
