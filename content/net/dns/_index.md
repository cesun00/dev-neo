---
title: "DNS"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

DNS is a request-response protocol, but hardly a client-server one.

## Zone Transfer

For all 

The slaver name server synchronize with the master name server through a process called zone transfer.

Zone Transfer

1. `AXFR` (complete zone transfer) or `IXFR` (incremental zone transfer)


1. ) The secondary name server for the zone reads (3 and 4) the SOA RR periodically. The interval is defined by
the refresh parameter of the Start of Authority (SOA) RR.
b) The secondary compares the serial number parameter of the SOA RR received from the primary with the
serial number in the SOA RR of its current zone data.
c) If the received serial number is arithmetically greater (higher) than the current one, the secondary initiates a
