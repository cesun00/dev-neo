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
    |                    QDCOUNT                    |   count of entries in question section; i.e. non-zero only in a query 
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    ANCOUNT                    |   count of RRs in the Answer section
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    NSCOUNT                    |   count of RRs in the Authority section
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    ARCOUNT                    |   count of RRs in the Additional section
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

{{<include-html "flags.html">}}

The header is then followed by 4 optional sections:

```goat
    +---------------------+
    |        Header       |
    +---------------------+
    |       Question      | QDCOUNT of question entries - the question for the name server
    +---------------------+
    |        Answer       | ANCOUNT of RRs answering the question
    +---------------------+
    |      Authority      | NSCOUNT of RRs pointing toward an authority
    +---------------------+
    |      Additional     | ARCOUNT of RRs holding additional information
    +---------------------+
```

## Resource Records

All of the answer, authority, and additional sections contain entries known as resource records.




-------------------------------------------------
-------------------------------------------------
-------------------------------------------------
-------------------------------------------------
-------------------------------------------------
