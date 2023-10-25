---
title: "Name Service Switch (NSS)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The Name Service Switch (NSS) is a convention in *NIX systems stating that the lookup order of certain administrative
information should be configurable in a `/etc/nsswitch.conf` file.

The NSS workflow introduced in this article was first invented by the Ultrix developer in 1984 but the config file was `/etc/svc.conf`.
Oracle Solaris was released in 1992 and was the first to call this pattern [Name Service Switch](https://docs.oracle.com/cd/E19455-01/806-1386/index.html).

GNU/Linux was actually late to the party. GNU glibc implemented NSS in version 2.4 (2006-03-06).
Before that, a keyword `order` existed in the `/etc/host.conf` file to control DNS lookup order.
(This file is still important nowadays for other configs).

It's a common misunderstanding in the Linux world that NSS is a subsystem of GNU glibc. It is not.
The glibc is only one software, among others, that respects the `nsswitch.conf` config file for some APIs it provides.

## `/etc/nsswitch.conf` file

Administrative information is organized into databases.
A local admin decides the sources of data, each known as a *service*,
when a database is queried by configuring the `/etc/nsswitch.conf` file.

By convention, each line of this takes the format:

```
<database name>:          service1 service2 ...
```

It is then the supporting software's responsibility to parse the file and determine
what to do with each line.

Below are 2 example `nsswitch.conf` files:
