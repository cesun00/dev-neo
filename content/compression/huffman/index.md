---
title: "Introduction to Huffman Coding"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- Coding Theory
- Huffman
---

## A Primer on the Coding Theory

- *An alphabet* is a set of symbols, e,g. `{a,b,c,d,e}`, or whatever symbols you like.
- *A code on a given alphabet* (abbr. code) is an assignment of a bit string to each symbol in the alphabet:

    e.g. 

    ```
    { a -> 1 , b -> 011 , c -> 01110 , d -> 1110 , e -> 10011 }
    ```

    The bit string assigned to each symbol (i.e. the right-hand side of each `->`) is known as a *code word*.

- A code is *non-singular* if no code word is duplicate. e.g. code `{a -> 0, b -> 0, c -> 1}` is not non-singular,
  but code `{a -> 0, b -> 1, c -> 01}` is.
- the *extension* of a code is a mapping (i.e. function) from the set of arbitrary sequences of alphabet symbols to the set of bit strings formed by replacing each symbol with its code word and concatenating the results:

    e.g. the extension of the code above is:

    ```
    {
        a -> 1 , b -> 011 , c -> 01110 , d -> 1110 , e -> 10011,
        aa -> 11, aaa -> 111, ....
        ab -> 1011, abb -> 1011011, ...
        
        ... 
    }
    ```

- A code is a *variable-length code* if the length of assigned bit strings differs among symbols. Fixed-length code is not very interesting.
- A variable-length code is *uniquely decodable* if its extension is non-singular.
  (i.e. there is no same bit string on the right-hand side of `->` for the extension).

    Given a code, the Sardinas–Patterson algorithm determines whether it is uniquely decodable in poly-time.

- A variable-length code is a *prefix code* if no code word is a prefix of another.

    e.g. the example used above is not a prefix code since the code word of `b` is a prefix of that of `c`.

    e.g. `{a -> 000, b -> 001, c -> 010, d -> 011, e -> 1}` is a prefix code.

- Every prefix code is uniquely decodable. The inverse is not true.

## Characterize a code

![](./code_venn.svg)

Given an alphabet, we study the practice of converting sequences of source symbols in that alphabet to bit strings by replacing each symbol with its code word and concatenating the result **according to some code**; and the inverse, decode the bit strings back to the source text.

Specifically, we care about whether a given code permits any bit string, provided that it is indeed converted from a source text,
to be uniquely decoded back to the original source text.

1. First, non-non-singular codes are hopeless. `0` can't be uniquely decoded if the code is `{a -> 0, b -> 0}`.
