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
