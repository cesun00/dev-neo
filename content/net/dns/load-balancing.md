---
title: "DNS Name Server Load Balancing"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article discuss 
For DNS-Round-Robin-based load balancing techniques for web applications, see ... TODO

## 2.4 Name Server-Intensive Environment Issues 

|                           | query `example.com` with RD=0 | query `example.com` with RD=1 |   |
|---------------------------|-------------------------------|-------------------------------|---|
| AA for `.` (root servers) |                               |                               |   |
| AA for `com`              |                               |                               |   |
| AA for ``          |                               |                               |   |