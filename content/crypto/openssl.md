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
Supported ciphers:
-aes-128-cbc               -aes-128-cfb               -aes-128-cfb1             
-aes-128-cfb8              -aes-128-ctr               -aes-128-ecb              
-aes-128-ofb               -aes-192-cbc               -aes-192-cfb              
# etc.
```

### PK Cert


## self-sign

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```

## inspect

```sh
# -noout: disable the default echo of cert pem source
# -text: print details in human readable text
# -inform: optionally specify the input format, in case auto detection failed
# -in <file>: gives the input file
openssl x509 -noout -text [-inform PEM] -in 1.pem
```

## TLS stream from CLI

## server 

```sh
# first generate a pair of self signed cert and key
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365
# listening tcp 4433 by default
openssl s_server -cert cert.pem -key key.pem
```

## client

```sh
openssl s_client -connect localhost:4433
```

## Transfer file like `nc` but secured

```sh
# sender
<in_file openssl s_client -connect hostname:4433

# receiver
>out_file openssl s_server -cert cert.pem -key key.pem -quiet
```
