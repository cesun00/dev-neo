---
title: "TLS Certificates"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- tls
---

## The ASN.1 / DER / PEM / PKCS#7

`ASN.1` is a DSL used to define structured data type formally. The 

`ASN.1` doesn't specify how an instance of structured data type gets serialized.

    e.g. is an integer always 4 bytes? Or is it arbitrarily long length-prefixed byte sequence? This is where various *encoding rules* comes in.

  - Distinguished Encoding Rules (DER): TODO
- PEM: a file format (conventionally named `*.pem` when stored on filesystem) defined as a sequence of text block, where each block is the base64 result of a single DER-encoded instance of ASN.1 type wrapped by a begin and an end delimeter.

<!-- ## PKCS#7: TODO -->

## X.509 Cert Format 

X.509 is the standard that define the format of
- public key certificate
<!-- -  -->

A X.509-conforming certificate is in binary format. Among other infomation, contains
