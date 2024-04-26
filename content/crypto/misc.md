---
title: "Cryptograph (unclassified)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
---


## randomart

`ssh-keygen` now prints an ASCII image, after the key is generated. It is safe to spread the image.
The image serves as a visual fingerprint, an easier way for humans to validate keys.


There is no industrial standard on how . It's openSSH's own feature.

See http://www.dirk-loss.de/sshvis/drunken_bishop.pdf for an analysis.

```
The key fingerprint is:
SHA256:ee296Fbg/INYE48cv5JxJELqUd4BIcQhXeJVwjoYPCk bitier@bite-into-reality
The key's randomart image is:
+--[ED25519 256]--+
|     ..==+*+.    |
|    E =oo++..    |
|     . +.* . .   |
|      . =.o.* .  |
|       .So.=.X   |
|        .. .O.=  |
|           o.O.. |
|          . =.+. |
|           oo... |
+----[SHA256]-----+
```

In implementing bit-order and byte-order
========

|          | pro | con |
|----------|-----|-----|
| LSB0     |     |     |
| MSB0     |     |     |
| LSB last |     |     |
| MSB last |     |     |

### LSB0

Pro
1. C's unsigned integer widening conversion naturally serves as appending unused 0 bit to the bit sequence.

Con
1. Treating consecutive bits as an integer, with first bits be more significant, requires reversing the bit order.

### MSB0




Block Cipher
=========

A block cipher embodies a random permutation generator....


## Windows Root CA Management

Certificate Store is Windows's abstraction for security-sensitive information storage, e.g. SSL certificates.

Windows support 2 certificate stores, a user-specific one and a system-wide one, search for `manage user/computer certificates` in startup respectively. (The latter requires admin privilege.)

Both certificate store is actually backed by the registry.

[Charles guide](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/) mentions:

> The certificate must be imported into the "Trusted Root Certification Authorities" certificate store, so override the automatic certificate store selection.

Note every application respect Windows' native certificate store. Chrome maintain its own internal Root CA list, and don't give a shit to Windows cert store.

https://www.venafi.com/blog/exploring-chromes-new-root-store-trust-vs-complexity
https://www.zdnet.com/article/chrome-will-soon-have-its-own-dedicated-certificate-root-store/

TODO: explain fields

![](./win-cert.png)


one-time pad - lacing secret into plaintext
==============

If alice and bob have a shared secret `k` of `n` bits, alice can send secretly (we'l discuss the definition later) a plaintext `m` of also `n` bits to bob by sending:

```
c = m ⊕ k
```

and bob can obtain the original `m` by:

```
