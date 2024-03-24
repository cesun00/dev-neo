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
1. When `n < 366`, `P` is incredibly large with even a small `n` / `P` grows incredibly fast with the increase of `n` from 1.
   - e.g. "counterintuitively, the probability of a shared birthday exceeds 50% in a group of only 23 people."
2. When `n >= 366`, for sure you know `P = 1` - the pigeonhole principle. The paradox is then often phrased as: (you don't know anyone's birthday at first, and you may query each person once for his birthday)
   a) the probability to find 2 person with the same birthday grows incredibly fast with the number of query; or
   b) in order to guarantee a certain probability (say 80%) of finding 2 person with the same birthday, the number of queries needed is incredibly small.

#1 and #2 essentially discussed the same problem: the size of the group `n` is simply the upperbound of how many queries you can make, and in #1 you just query everyone. `n` in #1 corresponds to the number of queries in #2. Actually, for #2, `n` doesn't really matter much. The moment you make the `m`-th query, the rest `n - m` person can be considered non-existent, and you've just queried every one a group of size `m`, turning the situation into #1.

Logic tricks. It turns out that the mindset of 2 is more useful in cryptography, because input space for CHF are always infinitely large.
But keep in mind that they are the same - Don't be suprised when you see someone referring to birthday paradox without mentioning 23 person and 50% probability - we always have infinite number of person for CHF.

<!-- BEGIN TODO -->
Let `B(x)` be a function that map `{all people}` to `{365 days in a year}`, given by taking one's birthday.
`B` is thus a hash function, by definition. (asking people for his birthday IS evaluating the hash function)

When a hash function distributes any input uniformly random into the output space (\*), the following are the same:
1. sampling inputs uniformly random from the input space, evaluate the hash function, and expect a duplicated output
2. sampling outputs uniformly random from the output space, and expect a duplicated sample


Under \* assumption, birthday paradox becomes a peculiar (i.e. no hashing even involved) but less counter-intuitive form: keep sampling from a given set, and it's easy to see a sample twice, and increasingly easier with the growth of times of sampling.

**Formalization**: 

For any hash function, the probability of finding at least 1 collision after `n`

it takes (only) `sqrt(2^n)` evaluations of the hash function to find an collision with a probability ... TODO, where `n` is the size (cardinality) of its output set.

<!-- TODO: if output set is larger than input set (i.e. not hash function anymore), does the probability of finding collision still ... wait, does that applies for all FUNCTIONS? -->

<!-- END TODO -->

**Birthday paradox is an intrisic weakness / property of ALL hash functions. It reveals the fundamental fact that the hardness of finding a collision depends on the size of the output space, not the input space. And if the output space is not large enough, you are in danger.**

Birthday attack: a less awkward name for brute force. Keep sending unused input into the hash function until a duplicate output is observed. For an ideal hash function that distributes all inputs uniformly random into 32-bits output space, it takes only 9300 evaluations to raise the probability of finding a collision to 1%, and 77,000 evaluations to 50%. This is essentially brute force.

Cryptographic hash function (CHF)
============

A CHF is a hash function, usually with some extra security property, but there is really no strict definition.

Given a CHF, the *preimage* of an output value is the set of all inputs that produces this output.

Related Attacks & security properties:
1. preimage attack: for a given `y` in the output space, find any `x` in the input space that hases to `y`.
   - Hardness (formally, being *computationally infeasible*) in doing so for a given CHF is known as *preimage resistance*.
   - preimage resistance is the most basic security promise - everything fucked up if an CHF can't provide it.
2. second-preimage attack: for a given `m1` in the input space, find another `m2` where `H(m1) == H(m2)`.
   - Hardness ... *second-preimage resistance*.
   - Second-preimage attack is essentially a preimage attack with one preimage already known. Thus:
     - Second-preimage attack is less challenging than preimage attack for the adversary. If an adversary has already broken preimage game, he can just pass `H(m1)` to the preimage cracker and the result is the second-preimage `m2` he is seeking. (since there are infinitely many preimages of `H(m1)`, the probability of getting the same `m1` back is infinitely small.)
     - "being able to break preimage game implies being able to break second-preimage game ", taking the contraposition: "second-preimage resistance implies preimage resistance".
       - if an adversary can't even win a less challenging game (the second-preimage), he can't win more challenging ones (the preimage).
       - thus level of security: `second-preimage resistance > preimage resistance`
3. collision attack: find any `m1` and `m2` such that `H(m1) == H(m2)` (so-called "find a collision")
   - Hardness ... *collision resistance*.
   - Collision attack is essentially a second-preimage attack with the freedom to choose `m1`
     - Collision attack is less challenging than second pre-preimage attack: if an adversary has already broken second-preimage game, he can just choose an arbitrary `m1` and pass it to the second-preimage cracker and the result `m2` is the collision he is seeking.
     - "collision resistance implies second-preimage resistance" [credit](https://crypto.stackexchange.com/a/20998/66840)
     - thus level of security: `collision resistance > second-preimage resistance > preimage resistance`
   - Best collision resistance is that: no adversary can perform collision attack (i.e. find collision) more efficiently than birthday attack (i.e. brute force). Such hash function doesn't expose any information that an adversary can exploit thus do better than brute force.
4. *Chosen-prefix collision attack*: given 2 different prefix `p1` and `p2`, find any `m1` and `m2` s.t. `H(p1 || m1) == H(p2 || m2)`.
   - i.e. generalized form of collision attack.
   - Such attack captures the scenario where 2 files of different types (thus different initial magic, e.g. X.509 cert and PostScript document) are artifically created with collided MD5.

CHFs NEVER take keys.

## CHF design

Intuitively, a good hash function should exhibit the following property:
1. avalanche effect
2. PR, 2PR, CR.

### One-way compression function

A one-way compression function that transforms 2 input of length `N` to 1 output of length `N`.

"one-way" roughly means 

The most common way to construct a OWCF is from block cipher

## Merkle-Damgard Construction

The Merkle–Damgård construction is a methodology turning
1. a collision-resistent OWCF; and
2. an appropriate (a.k.a MD-compliant) padding scheme, featured by appending the length of the whole message (known as *length padding* or *Merkle–Damgård strengthening*).

into a collision-resistant hash function.

### Known vulnerability of MD

TODO