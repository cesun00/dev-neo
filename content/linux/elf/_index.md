---
title: "ELF: Executable & Linkable Format for Linux"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The Executable and linkable Format was developed in the late 1980's by folks at the [Unix System Laboratories](https://en.wikipedia.org/wiki/Unix_System_Laboratories), a short-lived company owned by AT&T whose primary errand is to develop and maintain the Unix System V.
ELF-formatted binaries first appeared in the System V Release 4 in 1989, accompanied by a [System V ABI](https://www.sco.com/developers/devspecs/gabi41.pdf) document the as the specification.

All 4 types of ELF files are referred to as *object files* by the specification.
This series of articles will align with the specification and avoid calling `.o` file as object files.

## standardization

The Executable and linkable Format was developed in the late 1980's by folks at the [Unix System Laboratories](https://en.wikipedia.org/wiki/Unix_System_Laboratories), a short-lived company owned by AT&T whose primary errand is to develop and maintain the Unix System V.
ELF-formatted binaries first appeared in the System V Release 4 in 1989, accompanied by a [System V ABI](https://www.sco.com/developers/devspecs/gabi41.pdf) document the as the specification.

Linux used `a.out` format in its early days since 1991 and switched to ELF c. 1995.

first appeared standardized by the Tool Interface Standards (TIS) Committee.
TIS was an organization consists of representatives from Absoft, Autodesk, Borland International Corporation, IBM Corporation, Intel Corporation.

After the committee dismissed, the maintainance of 

ELF is designed with extension mechanism in mind. Specifically, TIS wanted to allow third-party ABI developer ... .
As a result, many fields only contains 1 legal value (macro) as per the spec, but may has new value of ad-hoc semantics up to some third-party.

For portability consideration, ELF uses no bit fields (sub-byte data unit).