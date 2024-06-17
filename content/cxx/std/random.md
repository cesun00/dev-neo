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
