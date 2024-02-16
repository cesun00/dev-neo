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

    listen-on-v6 {
        // interfaces to listen on, IPv6 address
        // ...

        any;        // special `any` listen on all IPv6 ifaces
    };

    // Uncomment these to enable IPv6 connections support
    // IPv4 will still work:
    
    // Add this for no IPv4:
    //  listen-on { none; };

    // 
    allow-recursion {
        127.0.0.1;
    };
    allow-transfer { none; };
    allow-update { none; };

    version none;
    hostname none;
    server-id none;
};

zone "localhost" IN {
    type master;
    file "localhost.zone";
};

zone "0.0.127.in-addr.arpa" IN {
    type master;
    file "127.0.0.zone";
};

zone "1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa" {
    type master;
    file "localhost.ip6.zone";
};
```

### ban / support recursive query (rd=1)

### zone files


1. The start of the line gives the owner of the RR. If a line begins with a blank, then the owner is assumed to be the same
as that of the previous RR. Blank lines are often included for readability.
2. TTL
3. type 
4. class

Class and type use the mnemonics




### 


## binaries

```conf
/usr/bin
    arpaname            # 
    ddns-confgen
    delv
    dig
    dnssec-cds
    dnssec-dsfromkey
    dnssec-importkey
    dnssec-keyfromlabel
    dnssec-keygen
    dnssec-revoke
    dnssec-settime
    dnssec-signzone
    dnssec-verify
    host
    mdig
    named
    named-checkconf
    named-checkzone
    named-compilezone
    named-journalprint
    named-nzd2nzf
    named-rrchecker
    nsec3hash
    nslookup
    nsupdate
    rndc
    rndc-confgen
    tsig-keygen
```


```
usr/lib/
usr/lib/bind/
usr/lib/bind/filter-a.so
usr/lib/bind/filter-aaaa.so
usr/lib/libbind9-9.18.24.so
usr/lib/libbind9.so
usr/lib/libdns-9.18.24.so
usr/lib/libdns.so
usr/lib/libirs-9.18.24.so
usr/lib/libirs.so
usr/lib/libisc-9.18.24.so
usr/lib/libisc.so
usr/lib/libisccc-9.18.24.so
usr/lib/libisccc.so
usr/lib/libisccfg-9.18.24.so
usr/lib/libisccfg.so
usr/lib/libns-9.18.24.so
usr/lib/libns.so
usr/lib/systemd/
usr/lib/systemd/system/
usr/lib/systemd/system/named.service
usr/lib/sysusers.d/
usr/lib/sysusers.d/bind.conf
usr/lib/tmpfiles.d/
usr/lib/tmpfiles.d/bind.conf
```

## References

1. https://kb.isc.org/docs/aa-01031 BIND 9 Administrator Reference Manual, a.k.a the ARM