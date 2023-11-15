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
m' = c ⊕ k
```

We turned a secret `k` and an message `m` into a secret `c` by XOR.

⊕(XOR) can be considered a binary-native way of propagating unpredictability (to adversary) of one bit sequence to another.  

Unfortunately, 



being computationally infeasible / hardness / difficult in cryptography
===================

In many context, we simply say e.g.
- "it should be hard to find a collision for a good CHF"
- "it should be hard to find plaintext from ciphertext without the key for a good blockcipher", or 
- "it's hard to find discrete logarithm".

None of these says "impossible": given enough amout of time, you can find collision in any CHF with probability 1 by brute force.

Hardness (or more formally, computation infeasibility) isn't a term that has strict mathematical definition.
It's not simply modeled by `the big-O complexity greater than ...` or `the probability of finding ... in m steps is less than ...`,
though sometimes such statements do appear as supportive material for the hardness discussion.

Hardness means the cost of computation (e.g. time / required memory / money to buy hardware) is greater than
the rewards of success in the computation. (e.g. adversary reveal password of a single account or all accounts in the DB).

Neither of the cost nor the rewards can be easily quantified, so the hardness can't be simply asserted by comparing 2 numbers.

The definition of hardness heavily depends on the detailed context of security game in question,
sometimes even on current productivity of current human's industry.
(e.g. no reliable quantum computation is possible *for now*, so breaking discrete log thus AES is hard, *for now*).

avalanche effect
========================

Intuition: flipping a single bit in the input will totally change the whole output.

Terms
==================
integrity       the data i'm receiving is not tampered with. Middle Man flipping even a single bit will be detected.
                but i'm not necessarily sure who the guy sending bits to me is.

Authenticity    I'm doing tcp with remote peer 187.a.b.c:11223, bob told me this is his amazing server, 



Man in the middle attack
---------------
A very nice intro to man in the middle : https://www.youtube.com/watch?v=-enHfpHMBo4

They say ADH is vulerable to man in the middle.

I used to think that man-in-the-middle doesn't work if you put a tag with the ciphertext.

Say Alice and Bob have a 128-bit shared secret already:
    1. They start to talk in AES128-CBC; Eve sees noise, but she can flip a bit, and the recipient can't detect by just looking at the received ciphertext. After decryption the recipient always see garbage, but the crypto system itself doesn't provide a way to detect tampering. Plus, you always have to decrypt first, which is a cost.
    2. They start to talk in AES128-CBC and each ciphertext is appended with the sha256 result of the ciphertext

The real world problem is 

Active MITM don't work if you have a tag. Flipping a single bit will be detected.

Passive MITM

To even have ciphertext, you need to do all the PKE thing and get a shared secret. The PKE thing starts with the server sending its public key to the client IN PLAIN TEXT. A man in the middle can intercept that and replace it with its own public key.


TODO: does self-signed cert protect against MITM attack?
https://security.stackexchange.com/questions/184969/how-mitm-attack-got-performed-on-self-signed-certificate-while-private-keys-is-g


Digital Signature
=======================
People used to say that digital signature is just to use the private key to encrypt the hash of the plaintext.

This could be VERY misleading since it feels like EVERY public key algorithm that has public-private key-pair can be used to do "signature". But actually this mindsetting only works for RSA, and ignorant people just think RSA is the whole public key encryption world.

For example in Diffie-Hellman key exchange, there are public key and private key, but they are NEVER meant to be used to "encrypt" or "decrypt" anything.

https://crypto.stackexchange.com/questions/835/why-cant-diffie-hellman-be-used-for-signing


EtM / MtE / E&M
====
https://crypto.stackexchange.com/questions/202/should-we-mac-then-encrypt-or-encrypt-then-mac
https://en.wikipedia.org/wiki/Authenticated_encryption#Approaches_to_authenticated_encryption


PRF vs hash function
===========
https://crypto.stackexchange.com/questions/15935/is-there-a-difference-between-prf-and-a-hash-function

I think apparently hash function takes arbitrary length input though...


Compute the RSA public key from the private key
==============
RSA is a asymmetric cryptography system, of course meaning that no one can compute the private key from the public key ( in a reasonable time). But it's trivial to get the public key if you have the private key, because you always know those 2 primes p q and n=pq in the private key, and public key is just the fucking same n with `e=65537 or 3`. is exactly what the `openssl genrsa` and `openssl rsa` do.  See here for usage:
    https://stackoverflow.com/questions/5244129/use-rsa-private-key-to-generate-public-key
For ECDH it's also trivial:
    https://stackoverflow.com/questions/696472/given-a-private-key-is-it-possible-to-derive-its-public-key



KEM is real
======
https://tools.ietf.org/html/rfc5990


Play with openssl rsa
==================
Everywhere a public key can be used, a private key can be used too (without -pubin), 
since for RSA build public key from private key is trivial

### private key generation
```bash
openssl genrsa -out priv.pem
```

### extract n and e from that private key and form its public key
```bash
openssl rsa -in priv.pem -out pub.pem -pubout
```

### full asymmetric encryption
```bash
echo -n 'fuck' | openssl rsautl -encrypt -inkey pub.pem -pubin -out fuck_encrypted
```


### full asymmetric decryption
```bash
# only private key can be used to decrypt
openssl rsautl -decrypt -inkey priv.pem -in fuck_encrypted
```


### signature
```bash
echo -n 'fuck' | openssl rsautl -sign -inkey priv.pem -out fuck_signed
```

### verify signature
```
# use private key works... but lose the meaning of signature
openssl rsautl -verify -in fuck_signed -inkey pub.pem -pubin
```

TODO: I guess by `-sign`, the output file store the encrypted content together with the signature, which is not the traditional definition of "digital signature" where you "encrypt" (i.e. not sure this is standard term - can you "encrypt" with private key? - it's just raise the hash value to the power of `d` (mod n)) the hash of the plaintext using the private key and append it to the plaintext.

## openssl genpkey

It seems that `genpkey` command is more recently designed and contains the functionality of `genrsa`

Problem with PLAIN/RAW/TEXTBOOK RSA & Improvements
=====
https://crypto.stackexchange.com/questions/1448/definition-of-textbook-rsa
https://www.csa.iisc.ac.in/~arpita/Cryptography15/CT10.pdf

PEM are just base64-ed DER with some extra headers
=====


X509 CSR for existing keys
========
```bash
# generate a rsa private key as usual
openssl genrsa -out priv.pem 4096
# create a pkcs10 csr for it
openssl req -new -key priv.pem -out req.csr
# verify that the request contains only the public key,
openssl req -in req.csr -noout -text
# and the modulus are the same
openssl req -in req.csr -noout -modulus
openssl rsa -in priv.pem -noout -modulus
# TODO ... sign it and return the cert...
# openssl ca ...?
```

The `-key` here has to be the private key, I think it's because the CSR need to be signed by the request maker, but the private key is NOT stored in the CSR. The CSR is a request to the CA to sign your (public key, identity info) you know. And the public key for RSA is trivially got from the private key.

All right, wikipedia's certificate is signed by a CA whose common name is "Let's Encrypt". But how do I find this issuer's public key so that I can verify the signature on wikipedia's cert?
=======
The "distinguished name" seems to be important
https://security.stackexchange.com/questions/20869/how-is-an-x509-certificate-signer-verified
https://stackoverflow.com/questions/28147848/how-do-i-check-if-certificate-a-got-certfiicate-b-as-issuer-in-java-x509cer

not very sure ... these are "extensions" ... 
```bash
openssl x509 -in cert.pem -noout -text
...
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature
            X509v3 Extended Key Usage: 
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Subject Key Identifier: 
                EA:38:F6:8E:A8:D2:66:AA:4C:64:73:89:B7:35:BB:F8:7E:DF:B1:FE
            X509v3 Authority Key Identifier: 
                keyid:A8:4A:6A:63:04:7D:DD:BA:E6:D1:39:B7:A6:45:65:EF:F3:A8:EC:A1

            Authority Information Access: 
                OCSP - URI:http://ocsp.int-x3.letsencrypt.org
                CA Issuers - URI:http://cert.int-x3.letsencrypt.org/
```

The "Fingerprint" thing
=====================
Fingerprint is just the hash of some data.

In the certificate detail page of chrome and firefox, usually there will be a "Fingerprints" section showing the SHA256 and SHA1 checksum of something. Those are the checksum of the DER certificate, and is NOT a part of the certificate itself. Browsers provide those checksum to make it easier for user to check.

To verify 
```bash
# wikipedia.org cert
openssl x509 -in cert.pem -outform DER | sha256sum 
9eb21a74a3cf1ecaaf6b19253025b4ca38f182e9f1f3e7355ba3c3004d4b7a10  -
```

https://security.stackexchange.com/questions/14330/what-is-the-actual-value-of-a-certificate-fingerprint

HMAC
===================

A MAC is a conceptual combination of 3 algorithms:

1. a key generation that sample a key uniformally random from the key space
2. a signing algorithm that takes a)the key and b) the message to send, and produces a `tag`
4. a verifying algorithm that takes the a)`tag`, the key and the message, and produce "accept" if the (message, tag) pair has not been tampered with since being produced, or "reject" otherwise.

MAC is mainly a measure to ensure the integrity of data in transmission, since the key should never been send out or seen by the outside world.

One technique to implement a MAC is to use a CHF, and such technique is called HMAC. CHF is known to produce a small fixed size bit sequence that can be used as a tag. The only problem is that CHF does not takes key. HMAC gives a way to wrap a CHF in its core and takes a key.

