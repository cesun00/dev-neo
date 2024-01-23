---
title: "x86 Base Instructions"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- CPU
- x86
---

Quick reference for base x86 instructions as defined by intel 80386.
See other pages for x86 extensions and details on when and since which model they are introduced.

## Categorized Instructions

### Data Movement:
1. `MOV`: transfers a byte, word, or doubleword from the source operand to the destination operand.

    See also `MOVSX` and `MOVZX`

2. `XCHG` (Exchange): swaps the contents of two operands. When used with a memory operand, XCHG automatically activates the LOCK signal.

### Stack Manipulation:
1. `PUSH` / `PUSHA`
2. `POP` / `POPA`

### Data Type Widening

Sign extension of a narrow data type to a wider one;
(extra bits of the larger item with the value of the sign bit of the smaller item)

The `CXY` family has no operand and only read from `EAX` registers:
1. `CBW` (byte to word): `AL` -> `AX` (`AH` `AL`)
2. `CWD` (word to doubleword): `AX` -> `DX` `AX`
3. `CWDE` (Word to Doubleword Extended): `AX` -> `EAX`
4. `CDQ` (doubleword to quad-word): `EAX` -> `EDX` `EAX`

The `MOV` variants take 2 operands, at most one can be memory access:
1. `MOVSX dest, src` (Move with Sign Extension): sign extend and move 8-bit src to 16-bit dest, or 16-bit src to 32-bit dest
2. `MOVZX dest, src` (Move with Zero Extension): zero extend (i.e. inserting high-order zero regardlessly) and move 8-bit src to 16-bit dest, or 16-bit src to 32-bit dest.

### Integer Arithmetic & Comparison

1. overflow is defined as;
2. borrow is defined as;
3. all instructions in this section update all `OF, SF, ZF, AF, and PF` according to the result. See details for what happens to `CF`.

- `NEG dest`: `dest = 0 - dest`; set `CF` if `dest` is not 0, unset otherwise.
- `ADD dest,src`: `dest = dest + src`; set `CF` if overflow, unset otherwise.
- `ADC dest,src` (add with carry): `dest = dest + src + CF`; No flag affected.

    Pattern: `ADD` followed multiple `ADC` instructions can be used to add numbers longer than 32 bits.

- `INC dest`: `dest = dest + 1`; `CF` unaffected.
- `SUB dest, src`: `dest = dest - src`; set `CF` if borrow, and update all of `OF, SF, ZF, AF, PF` accordingly
- `CMP dest, src`: like `SUB` but don't write back the result.
- `SBB dest, src` (subtract with borrow): `dest = dest - src - CF`;

    Pattern: `SUB` followed by multiple `SBB` instructions may be used to subtract numbers longer than 32 bits.

- `DEC dest`: `dest = dest - 1`; `CF` unaffected.

- `MUL src` (Unsigned Integer Multiply): `AX = AL * src` or `DX:AX = AX * src` or `EDX:EAX = EAX * src`;

- `IMUL` (Signed Integer Multiply):
    - `IMUL dest`:
    - `IMUL dest, src`
    - `IMUL dest, src1,src2,`

- DIV
- IDIV


## Decimal

x86 has some limited support for decimal arithmetic (let's reserve the word floating point to x87 coprocessor).
It is based on packed BCD representation:

All these instructions cause undefined behavior in AMD64 architecture:
1. `DAA`
2. `DAS`
3. `AAA`
4. `AAS`
5. `AAM`
6. `AAD`

See also AMD64 architecture instruction `fbld` and `fbstp` which don't exist in 80386.

### bitwise operation & Manipulation

The following 4 instructions update `SF, ZF, and PF` flags according to the result, clears `OF` and `CF`, and leaves `AF` undefined.
- `NOT dest`: flip each bit in `dest`
- `AND dest, src`: bitwise AND and store result to `dest`; See `TEST` for a no-write-back version of AND.
- `OR dest, src`:  bitwise OR and store result to `dest`
- `XOR dest, src`: bitwise OR and store result to `dest`

AND, OR, and XOR clear OF and CF, leave AF undefined, and update SF, ZF, and PF.

The location of the bit is specified as an offset from the low-order end of the operand.

- `BT src, offset` (Bit test): store the `offset`-indexed bit in `src` to `CF`
- `BTS src, offset` (Bit test and set): same as `BT`, plus set that bit in `src` to 1
- `BTR src, offset` (Bit test and reset): same as `BT`, plus set that bit in `src` to 0
- `BTC src, offset` (Bit test and complement): same as `BT`, plus flip that bit in `src`

- `BSF dest, src` (Bit Scan Forward): find the least significant 1 in `src` and store its bit index to `dest`.
- `BSR` (Bit Scan Reverse): find the most significant 1 in `src` and store its bit index to `dest`

(The bit index of the least significant bit is 0.)

```
<-most significant (left)           least significant (right)->
31 30 29 28     ...                                       2 1 0
```

- `SAL dest` / `SAL dest, count` (Shift Arithmetic Left): shift `dest` left by `1` or `count`, pad 0 from right.
- `SHL` (Shift Logical Left): identical to `SAL`
- `SAR` (Shift Arithmetic Right):
- `SHR` (Shift Logical Right):
- `SHLD` (Shift Left Double)
- `SHRD` (Shift Right Double)

Pattern: `SAR` can be used to simulate `IDIV`:

```asm
TODO
```

- `ROL` (Rotate Left)
