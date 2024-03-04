---
title: "Primer Cryptography Math"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- hash
- cheetsheet
---

## Glossary

- domain: set of possible function input.
- range: set of actual output of function, i.e. `<range> := {T(x) for all x in domain}`
- codomain

    This term is commonly used in 2 context:
    1. when you want to emphasize the dimensionality of the output space. e.g. we say `T(x) = 0` is an `R -> R` transformation. We say the codomain is `R` to emphasize the fact that we are not mapping to a 2D vector space, etc., even we know the output is always 0. (i.e. *range* is `{0}`).
    2. when you have 2 sets already in mind first, and want to discuss mappings (i.e. functions) from one to the other. The source set is always referred to as the domain, and the destination set is always codomain, regardless what a function looks like, potentially among multiple functions to be discussed. *In this context, we say "range" is a subset of "codmain".*

- image: [synonym for range](https://math.stackexchange.com/a/3141287/745303)
- preimage: (when a certain subset of codomain is identified)

## Bit-op

Integer addition, at bit level has the following truth table

| + | 0 | 1            |
|---|---|--------------|
| 0 | 0 | 1            |
| 1 | 1 | 0 with carry |
