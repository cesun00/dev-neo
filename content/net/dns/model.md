---
title: "DNS as a general-purpose KV store: Model and Design"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---



<!-- DNS is a service that maps a triplet `(dot-segmented string, net, type)` to an arbitrary byte sequence.
When `net=Internet`, some of  -->

This article gives an overview of the design of the Domain Name System.

## The Hierarchical Name Space & Domains

In the center of the Domain Name System is the idea of a tree of names, known as the hierarchical namespace.

```goat
                            (empty string)
                                   |
                                   |
             +---------------------+------------------+
             |                     |                  |
            MIL                   EDU                ARPA
             |                     |                  |
             |                     |                  |
       +-----+-----+               |     +------+-----+-----+
       |     |     |               |     |      |           |
      BRL  NOSC  DARPA             |  IN-ADDR  SRI-NIC     ACC
                                   |
       +--------+------------------+---------------+--------+
       |        |                  |               |        |
      UCI      MIT                 |              UDEL     YALE
                |                 ISI
                |                  |
            +---+---+              |
            |       |              |
           LCS  ACHILLES  +--+-----+-----+--------+
            |             |  |     |     |        |
            XX            A  C   VAXA  VENERA Mockapetris   
```

<!-- credit: https://www.rfc-editor.org/rfc/rfc1034.html -->

Each node on the tree is assigned a *label*, e.g. `edu`, `mit`, etc.
The label of the root node is `""`, an empty string, a.k.a the null label.

> Each node has a label, which is zero to 63 octets in length. Brother
> nodes may not have the same label, although the same label can be used
> for nodes which are not brothers.  One label is reserved, and that is
> the null (i.e., zero length) label used for the root.

To uniquely identify a node `x` in the tree, people concatenate the label on the path from `x`
all the way back to the root node, separated by a dot - a syntax known as the *domain name*.

> The domain name of a node is the list of the labels on the path from the
> node to the root of the tree.  By convention, the labels that compose a
> domain name are printed or read left to right, from the most specific
> (lowest, farthest from the root) to the least specific (highest, closest
> to the root).

The fact that the root node has a null label has several implications:
1. When a user needs to type a domain name, the last character will be a dot (the one separates a TLD the empty string)
2. The [length-prefixed binary encoding](TODO{{<ref "">}}) of domain names used in DNS messages always ends with a `null` byte, indicating the zero-length null label.

The term *domain* when used alone refers to the whole subtree rooted at a node identified by a domain name.

RFC1034 requires that all programs that manipulate domain names treat them in a case-insensitive manner,
and preserve their cases when possible. In real life this means


// ----------


