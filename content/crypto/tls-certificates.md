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

1. the "subject", roughly, a struct of location, names, contact info, etc., of a entity in real world a.k.a "end entity". For detailed structure see X.500 distinguished name (DN).
2. a public key, claimed to be the public key of the subject in (1)
3. the issuer
4. the issuer's public key


Upon presented, an CA-verifiable X.509 certificate is essentially a precise mathmatical proof of the following statement:

> The `PrintableString` listed in the *subject* field of this certificates **is associated with** the public key in the *subjectPublicKeyInfo*.

i.e. it proves a pair `(subject strings, public key)` under a chosen PK algorithm is recognized by root CA if the trust path if valid.

Note that X.509 certificates is designed to be a general purpose certificate, and *subject* can literally be any strings (with a sub-structure). Specifically, the subject isn't necessarily a hostname. (The `CommmonName` field within *subject* is only required to be a valid hostname if X.509 certificate is used in TLS, as a nowadays common practice.)

Also, the sematics of such **association** is unspecified by X.509, but should be defined by whatever protocol that uses X.509 certs. e.g. TLS defined such **association** to be "the public key a subject.CommonName hostname should be using when performing TLS handshake".

## Certificates storage and lookup

The base64 encoding of DER encoding of a X.509 cert is known as "PEM" format, and is defined by RFC 7468.

Files storing these base64-ed strings usually have the suffix `.pem`.

 <!-- Each `.pem` file can hold multiple base64-ed certificates. TODO: crt bundle?-->

Location and directory structure for storing those pem files on an unix system are never standardized.

Historically, OpenSSL first used a structure under `/etc/ssl`, leading to many later softwares errorneously assumes this directory.
Different distros still use different directories today, but provide `/etc/ssl/*` as a collection of symlinks for compatibility.

Archlinux follows the convention of Fedora.

## x509

TODO.
