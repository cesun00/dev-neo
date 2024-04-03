---
title: "OpenSSL Suite"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
- openssl
---


### Glossary

*Cipher*: (for symmetric enc/dec) one block cipher + one mode of operation. e.g. `aes-256-cbc`.
<!-- *Security Level*:  -->


## Cheetsheet

### Symmetric Enc / Dec


```sh
# enc
openssl enc -<CIPHER> -pbkdf2 -in <PLAINTEXT_FILE> -out <CIPHERTEXT_FILE>

# dec
openssl enc -d -<CIPHER> -pbkdf2 -in <CIPHERTEXT_FILE> -out <PLAINTEXT_FILE>
```

For a list of supported `<CIPHER>`:

```bash
# openssl enc -list
