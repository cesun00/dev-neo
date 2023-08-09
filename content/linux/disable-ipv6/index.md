---
title: "Disable IPv6 Interfaces"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Resolving the name `localhost`.

 Allowing IPv6 in the kernel TCPIP stack is known to cause some ambiguity when

Unless explicitly mapped to `127.0.0.1` in `/etc/hosts`, `localhost` resolves to both `::1` and `127.0.0.1` when IPv6 functionality is activated in the NIC card driver, which is the case for most kernel build.

For ArchLinux, the stock `/etc/hosts` is empty. See the [filesystem](https://archlinux.org/packages/core/any/filesystem/) package.

{{<columns>}}

### gethostbyname (legacy)

```c
```

<--->

### getaddrinfo

```c
```
{{</columns>}}


This could cause many software to malform, like when drilling an localhost BIND server, the response is veryveryveryveryvery  slow __TODO__

Many softwares simply use the first 

## Chrome Network Failure when IPv6 is on


