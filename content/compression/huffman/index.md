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
