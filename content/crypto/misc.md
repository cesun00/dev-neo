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
