---
title: "ISO 9660 Disk Image"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

It is strongly suggested that a reader understand how an optical storage device
works at the physical level (the cancellation of laser phase and continuous spiral track).
Such understanding greatly helps one to comprehend the design of a filesystem designed for optical devices.

## ISO 9660

ISO 9660 released in 1988 specifies a read-only filesystem for optical disk storage.
The specification is close-sourced

The design of ISO 9660 focus on reducing non-sequential access 


ISO 9660 trace its origin back to High Sierra Format.


The Rainbow Books are a collection of CD format specifications generally written and published by standards bodies including the ISO, IEC, and ECMA.

<!-- ISO 9660/El Torito CD-ROMs -->

## ISO_13490

## Universal Disk Format (ISO/IEC 13346)

supplanting ISO 9660

Due to its design, it is very well suited to incremental updates on both write-once and re-writable optical media.

## libraries and utility

- `util-linux` has a simply `isosize` command that prints the length of an ISO-9660 filesystem and the count and size of sectors.
- `libcdio` is a GNU library that manipulates CD-ROM hardware and image files.

    Some functionality of `libcdio` directly talks to the CD-ROM hardware by issuing SCSI MMC

    Some CLI utilities are also included:
    - `cdda-player`: demo program for the library's ability.
    - `mmc-tool`: 
    - `cd-drive`: No argument is respcted. shows what drivers are available and some basic properties of
     cd-drives attached to the system.  Media may have to be inserted in order to get this info. 
    - `cd-info`:  foo
    - `cd-read`:  foo
    - `iso-info`:  list directory tree of iso 9660 filesystem
    - `iso-read`:  extract a certain file from iso 9660 filesystem

## related file format

https://en.wikipedia.org/wiki/NRG_(file_format)