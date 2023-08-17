---
title: "RSA"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- asymmetrical cryptography
---

If we can find 3 integers `e`,`d` and `n` such that **for all** `m ∈ [0,n)`, `m^e^d % n = m` holds,

(i.e. one can pick any `m`, and get the same `m` back by raising `m^e^d` - all under modulo `n` arithmetic system)

then according to the discrete log hardness assumption (DLHA), it should be computationally infeasible to
1. recover `m` by knowing only `m^e`, `e` and `n`.
2. recover `d` by knowing only `e`, `n` and `m`.

The above idea can be viewed as an attempt to exploit DLHA in an intuitive way.

RSA defines `m` to be the plaintext. Ecryption/decryption is rather simple. Under the modulo-`n` system:
1. encryption can be done by simply raise `m` to the power of `e`; the integer `m^e` is the ciphertext.
2. decryption can be done by raise ciphertext `m^e` to the power of `d`, thus getting `m` back: `m^e^d = m`W

Also note that, due to the associativity of normal integer power, `e` and `d` are interchangable in all discussion.

Key Generation (find `e` and `d` for arbitrary `n`)
--------------

`n` is the upperbound of the plaintext and ciphertext (all simply integers). It's the boundary of the stage of whole game we are about to play next.

It's provable that no such `e` and `d` exist for most choice of `n`. Fortunately, all we need is a sufficiently large `n` so that we have enough room for the game.

To choose a proper `n` s.t. `e` and `d` exist,

As an example, the public key used by `gnu.org` (`CN=wildebeest1p.gnu.org` with altname) choose the following `n`:

```
Modulus:
    00:ba:db:32:ed:c0:61:5d:9e:2e:66:96:bb:18:5c:
    3d:90:d3:d3:85:b2:ce:48:10:ed:20:68:6f:08:a1:
    4c:37:7a:ab:53:a9:ab:96:83:db:4c:ec:c6:c6:74:
    29:ee:25:91:3a:24:58:8e:4a:15:5d:d5:24:7e:08:
    6f:87:3c:23:f9:ab:4f:1f:eb:d0:e2:83:40:3c:ce:
    d9:05:e1:dd:55:85:6c:df:d4:7a:3d:ee:94:b0:e6:
    b6:e5:b5:29:c4:63:fd:c8:e4:a7:28:a7:cd:79:66:
    6f:d5:95:f3:39:81:b6:60:77:bf:d8:6c:c3:aa:af:
    4b:fb:46:bd:a8:cc:16:76:d4:78:b6:9c:2b:ef:5b:
    54:35:31:68:60:d9:d5:a1:4e:0d:b8:b9:9f:2c:3c:
    d1:d0:1b:26:4e:36:bb:13:dd:dc:3b:23:1a:a0:39:
    63:0d:73:1d:7f:f9:65:a7:fc:7c:5e:46:86:73:99:
    3b:96:33:0a:f1:06:da:43:ca:42:81:c7:3f:dc:28:
    80:03:0d:43:65:a5:65:e9:d8:82:98:51:4f:c1:fa:
    73:b3:1a:70:6c:ee:c3:87:41:b3:f5:89:62:79:83:
    e0:39:7d:ad:95:76:15:50:44:b9:2a:40:4d:b9:eb:
    5e:88:d6:da:14:89:1d:ac:70:d0:b7:88:8a:ac:84:
    e9:55
```

which is the 257 bytes integer of magnitude `10^617`:

```
23588415749756431701588960195862565706382000239316988056239025194853931479305322270804132619317829383224708289781289427083001460996012926446365811675475931614847334873226624297526199734981968011813036900677341147172238741698625320996911112464956676014115549448116301849668246276491097211075624129671819615378428761947067898524656135752748690842466620732692063030075397824446140619688926059133543739820396781885913673171724047078764829422537826204004510573644176592933525959026407936560434947173287048242160116233200135755864174165961221494054836941543917265772225019052708103922941299666312543916598312797543273392469
```


Signature
------------

For Alice to send to Bob a message with her signature, she hashes the message (e.g. with SHA256) and raise the (properly padded) hash value to the power of her private key `e`.
