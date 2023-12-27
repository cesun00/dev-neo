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

"Superscalar" is Intel's marketing name of a instruction pipelining technique.
 
pipelined computer usually has "pipeline registers" after each stage. These store information from the instruction and calculations so that the logic gates of the next stage can do the next step.

It is common for even-numbered stages to operate on one edge of the square-wave clock, while odd-numbered stages operate on the other edge.

Finding a branch instruction in the decode stage simply indicates that all later instructions currently in the pipeline before the decode stage is garbage.
Design varies when it comes to the question "what to do when decode stage reports a branch instruction".

1. Do nothing. The pipeline runs as usual, 
2. Discard all garbage in the pipeline (known as *pipeline flushing*)

### multiple-issue width

- more issue width means
- less TODO

## hazard

hazards are situations where the next instruction cannot execute in the following clock cycle, and, if it does so anyway, can potentially lead to incorrect computation results.

Traditional programming model (i.e. before the advent of pipelined processor) assumes:
1. instructions are executed one after one in their text order in the program; and
2. the consequence of a previous instruction is immediately available to the next adjacent one:

```
# assuming old AX is 42
ADD 1 to AX         
MOV AX to BX        # according to SEA, a read from AX should observe incremented AX, i.e. 43
```

Applying naive pipeline will break that assumption: think about a sliding window over instruction texts unconditionally slide 1 instruction forward upon each clock tick. 
In the example above, `read from AX` in the 2nd instructions can happen before `write of incremented value to AX` in 1st instruction, since execution stage is after read stage.

Thus pipeline designer face the choice:
1. design more sophisticated pipeline scheduling, in order to not break compatibility with the programming model; or
2. break the model anyway, fuck all old programs and ask programmer to be awared of the naive pipeline design in newly written code.

## SMT

Now you have superscala anyway. Vendor may then choose to build SMT into each core to fill bubbles, or not.

## cache associativity

higher assoc
- harder for cache tag to collide, thus eviction happens less frequently, thus more cache hit rate.
- hard to make it fast (i.e. use more comparator, cost more)
- hard to increase cache size

low assoc:
- higher probability for collision, eviction happen frequently, low cache hit rate
- easy to make it fast
- easy to increase cache size

In real design L1 cache has low assoc e.g. 2, while L2 can be 16-way assoc.




## SIMD

| Instruction Set | Since            | Register Names | Bit width | Comment                        |
|-----------------|------------------|----------------|-----------|--------------------------------|
| MMX             | Pentium 2        | MM0~MM7        | 64        | registers are for integer only |
| SSE             | Pentium 3        | XMM0~XMM31     | 128       |                                |
| SSE2            | Pentium 4 & Xeon | XMM0~XMM31     | 128       |                                |
| AVX2            |                  | YMM0~YMM31     | 256       |                                |
| AVX512          |                  | ZMM0~ZMM31     | 512       |                                |


## Instruction Cycle

- Memory Data/Buffer Register (MDR / MBR): a two-way register that store
  1. data just fetched from main memory; or
  2. data wait to be send (write) to main memory
- Memory Address Register (MAR): stores the memory address that MDR operation onto.
  - Common pattern for the control unit (CU) is to first store the address of desired data into MAR, and send a READ command (TODO: micro-op?) to the control bus. Memory controller, as a response, will send data designated by MAR to MDR via the data bus.


## CPU's perspective of the main memory: 2 types

x86 supports 2 types of view of the main memory:

- Byte addressing: Program live in a sequence of addressed byte called the *address space*. Uniform and simple.
- Segment addressing: Program live in multiple addressable spaces called *segment*. To access data in a given segment, you need a segment register and offset into that segment.

## classic 5-stage pipeline

Denote the previous clock up edge as `A`, and the next as `B`.

### instruction fetch

For this part of circuit, the following happens between 2 clocks:

1. the memory content (maybe in cache) pointed by `PC` register at the A is retrieved into the `IR` register.
2. `PC += 4`, unless a jump instruction is made available to the circuit of `WB` stages at A. Signals are wired back from `WB` circuit to IF circuit to set `PC` value to the jump target.

### instruction decode

For this part of circuit, the following happens between 2 clocks:

1. content of `IR` is inspected.
   1. If registers are referred (RISC allows referring to most 2 registers), their name is resolved to real indexes into the register file.
   2. If it's a jump instruction, the target address is computed. This step potentially requires simple arithemtic, and sometime ALU from `EX` circuit will be borrowed (which decreases the pipeline throughput if only 1 ALU is available)
      1. If the jump is conditional, it took the next cycle to evaluate the condition also in `ID` stage, which cause the `IF` stage to stall.
2. The status of `EX` circuit is inspected.
   - If it was running a multi-cycle operation during `PreA -> A`, this implies (at least) the `A -> B` interval will also be busy, and can't accept new command (i.e. input flip flops in `EX` circuit will not accept new bits). `IF` and `ID` stages stall.
    - otherwise, content of nominated registers are made available to the input flip flops of `EX` circuit and get hold there.

### execute

For this part of circuit, the following happens between 2 clocks:

1. content of `IR` is inspected to determine instruction behavior, and operand  

###

### write back
