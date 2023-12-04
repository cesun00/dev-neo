---
title: "BIND (Berkeley Internet Name Domain Server) User Guide"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Install the package from https://www.isc.org/software/bind/ or [check the package manager of your Linux distro](https://wiki.archlinux.org/title/BIND).

## run the name server

Run the `named` executable to start the name server.

For a test / debug launch, use `-g` flags


`named` by default turn itself into a background daemon; Use `-f` to prevent its disattachment and receive signals.

## configs

`named` upon its start up reads `/etc/named.conf` as the main config file.



```named
options {
    directory "/var/named";                 // the working directory contains zone files etc.
    pid-file "/run/named/named.pid";

