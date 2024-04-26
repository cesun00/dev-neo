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
-------------------------------------------------

## Domain Name's Encoding in Message

Wherever domain names needs to be nominated 

For all occurrences of domain names in the protocol message, The DNS protocol uses length-prefixed strings for each dot-separated domain segment called "label":

- 1 byte for length. Spec requires max length of a label to be 63 ASCII char, so 1 byte length is enough.
- That number of ASCII chars.

Since canonically all domain names end with an empty string segment, all valid sequence of segments ends with a `0`.

e.g. `www.cise.ufl.edu.` are divided into 5 labels, ending with a label of empty string, and is presented as 

```
0x03 w w w
0x04 c i s e
0x03 u f l
0x03 e d u
0x00
```

## Question

