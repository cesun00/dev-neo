---
title: "The DEFLATE data format and Gzip archive format"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- gzip
- deflate
---

## DEFLATE

DEFLATE is a data format used to store and transmit compressed data.
Specifically, it's an abuse to refer to DEFLATE as a compression algorithm.

The DEFLATE data format was designed Phil Katz, for version 2 of his PKZIP archiving tool,
and later standardized as the [RFC 1951](https://datatracker.ietf.org/doc/html/rfc1951).

The most popular and de-facto standard DEFLATE library is the [zlib]({{<ref "./zlib/index.md">}}).

<!-- This article serves as an introductory material to the DEFLATE compression data format. -->

## Overview

A DEFLATE formatted file consists of a sequence of *blocks*.
Each block is comprised of 2 parts: a description of a Huffman tree, followed by the actual compressed data.

The size of a block is arbitrary, except that non-compressible blocks are limited to 65,535 bytes.

DEFLATE is defined in terms of a sequence of bits where each bit is addressable.
The first bit of a byte is defined as the least significant bit.
(little-endian byte order + little-endian bit order)
