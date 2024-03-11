---
title: "Overview: GNU Autotools"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Writing correct Makefile is hard, even for highly experienced Make users.

GNU Make indeed has provided enough dynamic ability via the macro language part of its Makefile, 
such that a gigantic project like the Linux kernel can use only Makefile to sustain its whole lifecycle.
The price is that Linux's Makefile now takes a few days for a new maintainer to fully understand.
Its Makefiles is a mixture of conditional blocks triggered by variables from previous testing of the objective of this `make` invocation.