---
title: "IMAP Intro"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The first version of IMAP was proposed in 1986.
A number of iterations happened and the current stable version is `IMAP4rev1` (IMAP 4 revision 1), defined by RFC 3501;
the latest draft is `IMAP4rev2` defined by RFC 9051.

Check [this gist](https://gist.github.com/nevans/8ef449da0786f9d1cc7c8324a288dd9b) for a timeline of the development of this protocol.

We will be talking about the stable `IMAP4rev1` only, referred to simply as *IMAP* below.

IMAP impose a predefined model of hirarchical mailboxes and message (i.e. email) attributes,
so that mailboxes management and flags on email can be discussed as part of the protocol spec.

Like HTTP 1.1, IMAP a text-based, line-oriented, request-response protocol.
Line separator is mandated to be `\r\n`. So near an empty line you would see `\r\n\r\n`.

The formal syntax of IMAP is precisely specified by [Section 9](https://datatracker.ietf.org/doc/html/rfc3501#autoid-95)
with ABNF (not ASN.1, hooray). Roughly the transcript of a session would look like:

```
# TCP connection established
S: * OK [CAPABILITY IMAP4 IMAP4rev1 ID AUTH=PLAIN AUTH=LOGIN NAMESPACE] IMAP4rev1 Service ready\r\n
C: a001 login <USERNAME> <PASSWORD>\r\n
S: a001
```

By default, IMAP server listens on TCP port `143`, IMAPS (i.e. IMAP over tls) server listens on TCP port `993`.


Demo from CLI
-----------


```sh
```


On-wire Encoding
====================

Prototypical IMAP was designed when bandwidth was extremely limited, and only ASCII was of concern,
where only the least significant 7 bits in a byte is used.

To save network traffic, early IMAP requires that every ASCII character (occupying 8-bit when residing on the sender's memory) get converted to a 7-bit unit when pushed onto the wire. This effectively saves 1/8 bandwidth, which is non-trivial back to the old age, e.g. sending a 1 KiB buffer from sender memory will only induce 896 bytes of network traffic.