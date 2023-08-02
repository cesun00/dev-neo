---
title: "RSA"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- asymmetrical cryptography
---

If we can find 3 integers `e`,`d` and `n` such that **for all** `m ∈ [0,n)`, `m^e^d % n = m` holds,

(i.e. one can pick any `m`, and get the same `m` back by raising `m^e^d` - all under modulo `n` arithmetic system)

then according to the discrete log hardness assumption (DLHA), it should be computationally infeasible to
1. recover `m` by knowing only `m^e`, `e` and `n`.
2. recover `d` by knowing only `e`, `n` and `m`.

The above idea can be viewed as an attempt to exploit DLHA in an intuitive way.

RSA defines `m` to be the plaintext. Ecryption/decryption is rather simple. Under the modulo-`n` system:
1. encryption can be done by simply raise `m` to the power of `e`; the integer `m^e` is the ciphertext.
2. decryption can be done by raise ciphertext `m^e` to the power of `d`, thus getting `m` back: `m^e^d = m`W

Also note that, due to the associativity of normal integer power, `e` and `d` are interchangable in all discussion.

Key Generation (find `e` and `d` for arbitrary `n`)
--------------

`n` is the upperbound of the plaintext and ciphertext (all simply integers). It's the boundary of the stage of whole game we are about to play next.

It's provable that no such `e` and `d` exist for most choice of `n`. Fortunately, all we need is a sufficiently large `n` so that we have enough room for the game.

To choose a proper `n` s.t. `e` and `d` exist,

As an example, the public key used by `gnu.org` (`CN=wildebeest1p.gnu.org` with altname) choose the following `n`:

```
Modulus:
    00:ba:db:32:ed:c0:61:5d:9e:2e:66:96:bb:18:5c:
