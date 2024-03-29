---
title: "Linux Randomness APIs"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- linux
- posix
- C/C++
---

## C99 `rand()` and `srand()`

Range: `[0, RAND_MAX]`

## POSIX `random()` and `srandom()`

Range: `[0,2^31 - 1]`

No standard specifies the distribution, though common implementations seems to be uniform. (don't rely on that)
[credit](https://stackoverflow.com/questions/48454078/what-is-the-distribution-for-random-in-stdlib).

## POSIX `rand48` family

Uniform distribution random integer & float number generation.

"48" in those names indicates their nature of linear congruential algorithm with 48-bit modular arithmetic.

Such algorithms generate next random number sequence by recursively:

```
X_{n+1} = (a * X_n + c) % m
```

The choice of `(m, a, c)` choice differs among implementations and papers. POSIX mandates the following for `rand48` family:

```
a = 0x5DEECE66D
c = 0xB
m = 2^48
```

Once the next 48-bit `X` is computed, the return value of `[delnmj]rand48()` is determined by copying certain bits from `X` to the target data type.

- For `double`, TODO ...
- For `long`, TODO ...

The following pairs differs in their storage of `X`: internal buffer v.s. client-provided one. **None of these are thread-safe** - externalizing `X` buffer doesn't help - as they still share a global RNG state buffer. See their `*_r()` variants.

1. `drand48(void)` / `erand48(unsigned short[3])`

  Spit `double` with uniform distribution in `[0.0, 1.0)`.

2. `lrand48(void)` / `nrand48(unsigned short[3])`

  Spit `long` with uniform distribution in `[0, 2^31)`.

3. `mrand48(void)` / `jrand48(unsigned short[3])`

  Spit `long` with uniform distribution in `[-2^31, 2^31)`.

4. `srand48(long)` / `seed48(unsigned short[3])` / `lcong48(unsigned short param[7])`

Seeding functions.

- `srand48` sets the 32-MSB of `X` with the 32-LSB of argument `long`, and the 16-LSB of `X` with `0x330e`.
- `seed48` sets 48-bit `X` directly, and return the previous value of `X`.
- `lcong48` sets 48-bit `X` with `param[0-2]`, `a` with `param[3,5]`, `c` with `param[6]`; i.e. allow changing default slope and intercept of the line. Any subsequent call to `srand48` or `seed48` restores the default `a` and `c`.

One of those must be called before using `[dlm]rand48()`, but not `[enj]rand48()`.

## glibc-specific `getentropy()` (non-POSIX)

Return array of random bytes.

A wrapper to the kernel `getrandom()`.

## Linux syscall `getrandom()`

Return array of random bytes.

This syscall shares the same random source as
- `/dev/urandom` by default, thus usually won't block; exception is when urandom source is not initialize after boot (TODO: example).
- `/dev/random`, if `GRND_RANDOM` flag is set. in which case `getrandom()` blocks if kernel entropy is low.

 But is convenient when inside a chroot environment and filesystem pathes i.e. `/dev/?random` are not available.

## `/dev/random` & `/dev/urandom`

Convenient device files when array of random noise bytes are desired.

If arithmetic types (e.g. long / double) are desired, consider using the `rand48()` family which directly return those with nice distribution promise.