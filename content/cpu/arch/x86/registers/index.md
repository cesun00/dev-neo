---
title: "x86 Architectural and Model Registers"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

## General Purpose Registers

In 32-bit protected mode: EAX, EBX, ECX, EDX, EBP, ESP, ESI, and EDI.

## The Flags Register `EFLAGS`

This is a 32-bit register even for the AMD64 machine.
    
The following bits in the flag register are updated by most arithemtic operations unless otherwise noted:
- `CF`: carry flag; indicates whether a previous addition produces carry or a previous subtraction produces borrow.
- `OF`: overflow; 
- `SF`: sign flag
- `ZF`: zero flag
- `AF`: auxiliary carry
- `PF`: parity flag

## The instruction pointer register (EIP)

### Stack registers

stack pointer (ESP) register.
stack-frame base pointer (EBP) register.

The following instruction works by directly manipulation the stack registers:
1. 

## segments

<!-- The central idea of the segment model is that, instead of using absolute physical address, -->

The segment registers CS, DS, SS, ES, FS, and GS

These are 16-bit registers holding a segment selector, i.e. an index into the global/local...TODO descriptor table.
See [memory]() for details on the segment model of memory.

Once a segment is selected (by loading
the segment selector into a segment register), a data manipulation
instruction only needs to specify the offset.

form an address when only an offset is
specified:

- `CS` (Code segment)

    CS register can't be loaded (assigned) explicitly.
    It is changed implicitly as the result of intersegment control-transfer instructions (for example, CALL and JMP), interrupts, and exceptions.

- `SS` (stack segme)

    the SS register can be loaded explicitly, thereby permitting programmers to define stacks dynamically.

- `DS` / `ES` / `FS` / `GS`

    These registers specify 4 data segments, each addressable by the currently executing program.
    All of them can be loaded explicitly, thus allowing more data segments to be used during execution.
    

## Stack

x86 uses a push-down stack implemented in the main memory, bookkept by the following registers:
- `SS` (stack segment)
- `ESP` (stack pointer): hold the address of the top of stack, i.e. become numerically smaller after a `PUSH`.
- `EBP` (stack-frame base pointer): hold the base address of the current stack frame.

The current stack frame is defined as the memory in `[EBP, ESP)`.
`EBP` is used to access elements on the stack relative to a fixed point on the stack rather than relative to the current `SS`.

## Memory-Management Registers

segment descriptor tables GDT and LDT.

- `GDTR` (Global Descriptor Table Register)
- `LDTR` (Local Descriptor Table Register)

These registers point to the segment descriptor tables GDT and LDT.

- `IDTR` - Interrupt Descriptor Table Register

This register points to a table of entry points for interrupt handlers (the IDT).

- `TR` (Task Register)

    This register points to the information needed by the processor to define the current task.

## Control Registers

x86 has 4 32-bit control registers `CR0 - CR3`. AMD64 extends each to 64-bit, and has 4 additional ones `CR4 - CR7`.

These registers are accessible to systems programmers only via variants of the MOV instruction (`0F20` and `0F22` ones instead of ), which allow them to be loaded from or stored in general registers;

- `CR0`: a few bit flags
    - `EM` (Emulation, bit 2): indicates whether coprocessor functions are to be emulated.
    - `ET` (Extension Type, bit 4): indicates the type of x87 coprocessor present in the system (80287 or 80387).
    - `MP` (Math Present, bit 1): controls the function of the `WAIT` instruction, which is used to coordinate a coprocessor.
    - `PE` (Protection Enable, bit 0): Setting PE causes the processor to begin executing in protected mode. Resetting PE returns to real-address mode.
