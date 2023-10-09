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
