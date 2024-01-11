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
