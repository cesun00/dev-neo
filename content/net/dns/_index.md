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
zone transfer (5) using AXFR or IXFR (depending on the primary and secondary configuration), using TCP
over port 53 (6).




## 

// ===========

But due to the nature of DNS, `name` must exhibit some structure, adding complexity to the interface,
such that the referencing mechanism and administrative considerations of DNS can be implemented.

The mapping of all `name`s can't be maintained in a single point system for the following reasons:
1. 
2. DNS as a service must be highly available from 



The dot-separated syntax of `name` is not original to DNS, and has a long history of evolution, see TODO 

## Referencing Mechanics
m


DNS is designed with a hierarchical namespace corresponding to the hirarichchial organizaiion of human society.
This has several important implications:

> the idea of a hierarchical name space, with the
> hierarchy roughly corresponding to organizational structure, and names
> using "."  as the character to mark the boundary between hierarchy
> levels.

The vanilla spec requires a name server to faithfully reflect a real existing file locally on its disk named the *master file*. 
The master file thus become the main configuration file of the name server.
In modern implementatoins such file may be omitted.

------



The number of resource records are too large to reside on a single server's storage. plus ...

To solve this, DNS allows a name server to only know a subset of the map.
When a query arrives and the server knows the precise mapping, ;
otherwise, it might:

1. reject with `RCODE=REFUSED (5)`; or
2. if client set `rd=1` and the server is willing to perform recursive query on behalf of it.
   In this case, `ra=1` must be set in the response.
3. otherwise, 

I see real world cases where server ignore `rd=0` and return recursively fetched Answer willy-nilly, as well as return with `SERVFAIL`.



ns3.dnsv5.com.	172800	IN	AAAA	2402:4e00:1430:1102:0:9136:2b2b:ba61

ns4.dnsv5.com.	172800	IN	A	1.12.0.16
ns4.dnsv5.com.	172800	IN	A	1.12.0.19
ns4.dnsv5.com.	172800	IN	A	1.12.14.16
ns4.dnsv5.com.	172800	IN	A	1.12.14.19
ns4.dnsv5.com.	172800	IN	A	106.55.82.76
ns4.dnsv5.com.	172800	IN	A	112.80.181.106
ns4.dnsv5.com.	172800	IN	A	13.37.58.163
ns4.dnsv5.com.	172800	IN	A	150.109.248.236
ns4.dnsv5.com.	172800	IN	A	183.47.126.155
ns4.dnsv5.com.	172800	IN	AAAA	2402:4e00:111:fff::8


Name servers knows the mapping 