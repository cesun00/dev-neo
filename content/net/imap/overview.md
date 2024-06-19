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
