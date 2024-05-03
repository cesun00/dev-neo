---
title: "C++ Randomness Infrastructure"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

Support for randomness was introduced since C++11. Its design revolves around the following types of templates / classes / concepts:

## Concept `std::uniform_random_bit_generator`

Concept `std::uniform_random_bit_generator` models (class of) URBG (uniform random bit generators).

An URBG is a functor
1. whose `operator()` returns a sequence of uniformly random bits in the form of an unsigned integral value. (i.e. the returned integer is also uniform within `min()` and `max()`)
2. whose class has `min()` and `max()` *static* member functions and they make sense.

### Satisfying classes

#### Algorithmic

There are several std-defined class templates, each implements a well-known pseudo-random generation algorithm, upon whose instantiations creates classes that satisfy `std::uniform_random_bit_generator`:

1. class template `std::linear_congruential_engine`

    implements linear congruential algorithm.

    Pre-defined instantiations are:
    
    1. class `std::minstd_rand0` = `std::linear_congruential_engine<std::uint_fast32_t, 16807, 0, 2147483647>`
    2. class `std::minstd_rand` = `std::linear_congruential_engine<std::uint_fast32_t, 48271, 0, 2147483647>`

2. class template `std::mersenne_twister_engine`

    implements Mersenne twister algorithm
    
    1. class `std::mt19937` = `std::mersenne_twister_engine<std::uint_fast32_t, 32, 624, 397, 31, 0x9908b0df, 11, 0xffffffff, 7, 0x9d2c5680, 15, 0xefc60000, 18, 1812433253>`
    2. class `std::mt19937_64` = `std::mersenne_twister_engine<std::uint_fast64_t, 64, 312, 156, 31, 0xb5026f5aa96619e9, 29, 0x5555555555555555, 17, 0x71d67fffeda60000, 37, 0xfff7eee000000000, 43, 6364136223846793005>`

3. class template `std::subtract_with_carry_engine`

    implements a subtract-with-carry (lagged Fibonacci) algorithm

    1. class `ranlux24_base` = `std::subtract_with_carry_engine<std::uint_fast32_t, 24, 10, 24>`
    2. class `ranlux48_base` = `std::subtract_with_carry_engine<std::uint_fast64_t, 48, 5, 12>`

### Adaptors

There are also several non-algorithmic std-defined class templates, upon whose instantiations creates classes that satisfy `std::uniform_random_bit_generator`.
These class templates don't themselves implement math algorithm, but work as adaptors on top of other URBG, thus creating an alternative pattern of (*still uniform*) random bits.

1. class template `discard_block_engine` 

    discards some output of a random number engine

    1. class `ranlux24` = `std::discard_block_engine<std::ranlux24_base, 223, 23>`
    2. class `ranlux48` = `std::discard_block_engine<std::ranlux48_base, 389, 11>`

2. class template `independent_bits_engine`

    packs the output of a random number engine into blocks of a specified number of bits

3. class template `shuffle_order_engine`

    delivers the output of a random number engine in a different order

    `knuth_b` = `std::shuffle_order_engine<std::minstd_rand0, 256>`

### `std::random_device`: Opportunistic Hardware Randomness

