---
title: "Specification Makers in Cryptography"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- cryptography
---

### ITU-T and `X.*`

ITU (International Telecommunication Union ) is a United Nations affiliated organization.

ITU-T (ITU Telecommunication Standardization Sector) is one if ITU's 3 sub-departments that works on standardization of telecommunications.

ITU-T is further divided into study groups from `SG2` to `SG20`. Those study groups release standard specifications (they call "recommendations") identified by `<letter>.<number>`. For example `X` means *Data networks, open system communications and security*, and `X.509` identifies a specific document in `X` series.

Note that they haven't used up all letters, and also (unlike RFC) the number is not contiguously self-incremental. For a complete list of series letters and numbered documents in a series, see

https://www.itu.int/itu-t/recommendations/index.aspx

### RSA Security LLC and `PKCS #\d`

RSA Security LLC is an American company co-founded by the authors of the RSA algorithm since 1982. The standard they made is identified by `PKCS #` followed by a self-incrementing number, though there are gaps in the numbers when a document is abandoned or never get released. So far we have `PKCS #1` to `PKCS #15`.

### ASNI `X9.62`

### PKCS's spec and ITU-T's spec

https://security.stackexchange.com/questions/73156/whats-the-difference-between-x-509-and-pkcs7-certificate
