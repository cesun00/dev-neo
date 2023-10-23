---
title: "DNS Message & Resource Record Format"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## convention and glossaries

- 0 indicates the most significant bit.
- `RR` stands for *Resource Record*, see below.

## Message Format 

DNS is a request-response protocol.
The query and the response share the same format which always starts with a header:

```goat
                                    1  1  1  1  1  1
      0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                      ID                       |   a response must echo the same ID of its request
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |   flags - see below
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
