---
title: "Cryptographical Hash Functions"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- hash
---

This article discusses application of unkeyed cryptographical hash functions.
Some hash functions can take keys, thus creating different output for the same input.
<!-- See [MAC & HMAC: Keyed Hash Functions]({{/*<ref "./keyed-hash-func.md"*/>}}) for that. -->
See [MAC & HMAC: Keyed Hash Functions](https://en.wikipedia.org/wiki/HMAC) for that.

<!--more-->

## Hash Function

A hash function is any function that map an infinite input set (i.e. arbitrary data) to an output set of finite size (e.g. fixed-length bits).

There is no more requirement on the function for it to be qualified as a "hash function".
e.g. `f(x) = 0` for all real number is a hash function, though a poor one.

- Some contexts aren't security sensetive, e.g. `f(x) = 0` as the hash function of a hash table at worst leads to terrible performance.
- Others are in security / cryptography domain, e.g. store hashed password in database s.t. user's plaintext password is safe even if the whole DB is stolen. The intuition is that we want it really hard to derive (any information about) plaintext password form the stored hash.

## The Birthday Vulnerability of ALL hash functions

In a group of `n` randomly chosen people, denote `P` to be the probability of `at least two share the same birthday`.

The classic birthday paradox in fact has 2 interesting but often frivolously undistinguished expressions:
