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

{{<columns>}}

### ArchLinux stock

```nss
# Name Service Switch configuration file.
# See nsswitch.conf(5) for details.

passwd: files systemd
group: files [SUCCESS=merge] systemd
shadow: files systemd
gshadow: files systemd

publickey: files

hosts: mymachines resolve [!UNAVAIL=return] files myhostname dns
networks: files

protocols: files
services: files
ethers: files
rpc: files

netgroup: files
```

<--->

### Redhat VM

```conf
passwd:         files sss
group:          files sss
shadow:         files sss
gshadow:        files sss

hosts:          files mdns4_minimal [NOTFOUND=return] dns mymachines
networks:       files

protocols:      db files
services:       db files
ethers:         db files
rpc:            db files

netgroup:       sss
automount:      sss
```

{{</columns>}}

## glibc's behavior

For glibc, the following database names are recognized:

{{<include-html "db.html">}}

For each `SERVICE` mentioned for a given database, glibc will `dlopen(3)` a shared object named `libnss_SERVICE.so.X`,
whose code is responsible for providing actual answers to queries against the database.

These are some commonly seen services and their shared objects:

{{<include-html "so.html">}}

On my system, these are installed:

```sh
# /usr/lib $ ls -ahl $(find -name 'libnss_*')
lrwxrwxrwx 1 root root   18 Feb  2 01:38 ./libnss_compat.so -> libnss_compat.so.2
-rwxr-xr-x 1 root root  43K Feb  2 01:38 ./libnss_compat.so.2
lrwxrwxrwx 1 root root   14 Feb  2 01:38 ./libnss_db.so -> libnss_db.so.2
-rwxr-xr-x 1 root root  35K Feb  2 01:38 ./libnss_db.so.2
-rwxr-xr-x 1 root root  14K Feb  2 01:38 ./libnss_dns.so.2
-rwxr-xr-x 1 root root  14K Feb  2 01:38 ./libnss_files.so.2
lrwxrwxrwx 1 root root   18 Feb  2 01:38 ./libnss_hesiod.so -> libnss_hesiod.so.2
-rwxr-xr-x 1 root root  23K Feb  2 01:38 ./libnss_hesiod.so.2
-rwxr-xr-x 1 root root 163K Mar  4 01:04 ./libnss_myhostname.so.2
-rwxr-xr-x 1 root root 349K Mar  4 01:04 ./libnss_mymachines.so.2
-rwxr-xr-x 1 root root 175K Mar  4 01:04 ./libnss_resolve.so.2
-rwxr-xr-x 1 root root 379K Mar  4 01:04 ./libnss_systemd.so.2
-rwxr-xr-x 1 root root  27K Feb 19 22:36 ./libnss_winbind.so.2
-rwxr-xr-x 1 root root  23K Feb 19 22:36 ./libnss_wins.so.2
```

The listed order of services is significant. For a given database, its listed services form a [Chain-of-responsibility pattern](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern). Besides answers to the query (if any), a service also returns an enum value indicating the status of this lookup.
The `enum` is defined glibc's `nss/nss.h`:

```c
/* Possible results of lookup using a nss_* function.  */
enum nss_status
{
  NSS_STATUS_TRYAGAIN = -2,
  NSS_STATUS_UNAVAIL,
  NSS_STATUS_NOTFOUND,
  NSS_STATUS_SUCCESS,
  NSS_STATUS_RETURN
};
```

Glibc decides what to do with the answer produced by a service depending on the returned status enum.
By default:

| enum nss_status       | cause glibc to ...                                             |
|-----------------------|----------------------------------------------------------------|
| `NSS_STATUS_TRYAGAIN` | ignore the answer, and consult the next service down the chain |
| `NSS_STATUS_UNAVAIL`  | ignore the answer, and consult the next service down the chain |
| `NSS_STATUS_NOTFOUND` | ignore the answer, and consult the next service down the chain |
| `NSS_STATUS_SUCCESS`  | return the answer immediately                                  |
| `NSS_STATUS_RETURN`   | GLIBC INTERNAL USE ONLY.                                       |

These default behavior can be overridden by an extended syntax supported by glibc and Solaris:

```
<database name>:          service1 [status=action] service2 [status=action] ...
```

`action` will be taken when the return status of the *previous* service matches `status`, instead of the default behavior.
A `!` preceding `status`, e.g. `[!UNAVAIL=return]`, negates the condition.

Permitted values of `status` are:

```
STATUS => success | notfound | unavail | tryagain
```

which corresponds to the macros above in an obvious way.


Permitted values of `action` are:

```
ACTION => return | continue | merge
```

where `return` means to return the answer of the previous service immediately, and `continue` discards that answer
and consult the next service.

`merge` is only valid as `[SUCCESS=merge]`, and causes the answers from both the previous service and the next service to be merged before returning to the API caller.

## Considerations for Other Software

Newly written applications usually choose to use their own configuration files for things like lookup orders.
There is no good reason to keep using `nsswitch.conf` unless you are hailing to the tradition.

Historical applications respect `/etc/nsswitch.conf` for various reasons.
Most of them were written for Solaris and OpenBSD and were later ported to GNU/Linux.

An application that uses `nsswitch.conf` for certain lookup order configurations
must parse the file on its own for a line that contains the database name they care about.
It's completely under such applications' jurisdiction what to do with text in that line.

In all situations, glibc provides no utility that helps such an application to work with such parsing.

For example
- The `shadow-utils` package [parses for a line containing `subid` database](https://github.com/sudo-project/sudo/blob/f0823c70c6c220322cae3a7dae9500df252f990c/plugins/sudoers/sudo_nss.c#L162), then tries `dlopen()` a `libsubid_SERVICE.so`
for each mentioned `SERVICE`.
- The `sudo` package [parses for a line containing `sudoers` database](https://github.com/shadow-maint/shadow/blob/dc12e87fe78a79f7240b8b26ea4e33659f4c768c/lib/nss.c#L66), where each `SERVICE` corresponds to a different function
that returns the desired data - no other object is involved.

Common databases and their supporting software included:

| database name | supported by | semantics |
|---------------|--------------|-----------|
| gshadow       | shadow-utils |           |
| sudoers       |              |           |
| sudoers       |              |           |
| sudoers       |              |           |

##  `/etc/default/nss`

## Rant & Misc

I'd like to point out the fact that these databases are disparate in their nature, yet still managed by the same NSS subsystem.
and the *Name Service* Switch name doesn't reflect its current API.

Also, this article only talks about glibc's . Other packages such as the sudo and shadow-utils

The `database` keyword of `getent(1)` program accepts more database names then noted here.
Not all these databases are 

----


In the *NIX programming environment, certain administrative configurations of the local machine should be queried at run time,
instead of being hardcoded (if even possible at all). Examples are:

1. user or group information
2. the TCP or UDP port an application-layer protocol should use (IANA assignment)

    If you are the server author, say redis, in this case it's indeed possible to hardcode the port number and protocol to use,
    instead of querying the IANA assignment `redis 6379/tcp`
    
    https://unix.stackexchange.com/a/593722/245241

3. the numeric ID of an IP-layer protocol (e.g. TCP or UDP)
4. resolve a domain name to its IP address

This is handled by

The reason for its name, i.e. *Name Service* Switch, despite the fact that 

mapping from a  to its corresponding value (e.g. a , etc.) is required.

Despite 

The approach taken by GNU GLIBC implementation is providing 

There is an attempt in  that unify the interface of all such query, knwon .
To the author, whether this is an premature optimization or over-engineering remains to be a question,
but this article still introduce it as-is since it's simply out there available.



```sh
# ls /usr/lib/libnss* -al
-rwxr-xr-x 1 root root 1258120 Feb 18 01:14 /usr/lib/libnss3.so     # Network Security Service
lrwxrwxrwx 1 root root      16 Feb 18 01:14 /usr/lib/libnssckbi.so -> p11-kit-trust.so      #libnssckbi
-rwxr-xr-x 1 root root   14288 Feb 18 01:14 /usr/lib/libnsssysinit.so   # Network Security Services-sysinit
-rwxr-xr-x 1 root root  178368 Feb 18 01:14 /usr/lib/libnssutil3.so     # Network Security Services
```