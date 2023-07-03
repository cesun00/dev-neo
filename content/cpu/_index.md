---
title: "CPU"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

All about CPUs.

## glossary

Control unit. Within which:
1. instruction unit (IU) / instruction fetch unit (IFU) / instruction issue unit (IIU) / instruction sequencing unit (ISU)
2. execution unit.
3. Microarchitecture: the technique to design a specific range of CPU, determining how components are interconneted with each other.
   1. e.g. Intel Core 2, Intel Skylake and AMD Zen4 are all different Microarchitectures.
4. Instruction Set Architecture (ISA)

    An ISA is the collective name of well-defined
    1. instructions (semantics, encoding format, opcode and operands, addressing mode)
    2. data types (sign/unsigned byte/(d|q|dq)?word, floating, pointer, etc.)
    3. registers
    4. main memory requirement & management

    e.g. IA32, x86 and 

## Memory Controller

Sometimes, Memory Controller Unit (MCU); don't get confused with Microcontroller Unit (also, MCU).

Memory Controller is the part of circuits that directly controls the memory (data and address) bus

Early microprocessor models ...

## Out-of-order Execution (OOOE)

In-order pipeline can't proceed (i.e. fetch new instruction) when one of following happens:
1. data required by the currently decoded instruction aren't available in this clock cycle
2. next stage of currently decoded instruction has conflict with previous unfinished instructions in the pipeline (e.g. `RAW` or `WAW`).
3. currently decoded instruction is a branching one - adjacent instructions are simply garabge and must not reach execution stage.

## Pipelining

Pipelining is good and is always wanted in CPU design. The problematic behavior above just indicates that more sophisticated control of the pipelining technique must be implemented.

Whenever the SEA is false in the naive pipeline model, its known as a *hazard*.

it means extra measures must be taken when implement real-world pipelining, either by end programmer or by CPU designer, to ensure - to a certain extend - the result of computation is still correct - e.g. `BX is 43 not 42`.

Deeper pipeline means
1. less work per stage (i.e. less work per cycle), meaning that the stateless async circuits between each stages is simpler thus having shorter propagation delay ; eventually meaning that higher clock frequency can be achieved.
2. you can have more instruction in-the-fly within pipelines:
    - good thing is that you have higher instruction throughput, of course;
    - bad thing is increased penalities when branch predication fails.
3. you have more stages to fill, since you don't want more bubbles just because you have deeper pipelines. This usually means more sophisticated OOOE logics has to be deployed, consuming real estates on the chip.


## "Superscalar" a.k.a multiple-issue

