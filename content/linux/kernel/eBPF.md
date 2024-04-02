---
title: "Linux eBPF Subsystem"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- linux
---

## The DIGITAL UNIX Packet Filter

The Digital Equipment Corporation (DEC), founded in 1957 and defuncted in 1998, once owned 2 Unix variants, Ultrix (based on BSD) and Tru64 Unix (based on OSF/1).
Tru64 Unix is also known as the "Digital Unix" (digital from DEC's name). Tru64 was then purchased by Compaq and finally the HP company.

Tru64 Unix provided a network packet filtering mechanics known as The DIGITAL UNIX Packet Filter, aka. `packetfilter`, which is later also ported to other products e.g. Ultrix and OSF/1. https://www3.physnet.uni-hamburg.de/physnet/Tru64-Unix/HTML/MAN/MAN7/0060____.HTM

The workflow for the DIGITAL UNIX Packet Filter:
1. Admin invokes `MAKEDEV pfilt` under `/dev/` to create character devices files `/dev/pf/pfilt[001-064]`.
2. User process open one of them with a `pfopen()` call, obtaining an int `fd`.
3. User process call `ioctl` on `fd` with `EIOCSETF` command and a `struct enfilter *filter` pointer.

    A `struct enfilter` instance holds a numeric priority and a list of filter commands:

    ```c
    struct enfilter {
        u_char   enf_Priority;
        u_char   enf_FilterLen;
        u_short  enf_Filter[ENMAXFILTERS];
    };
    ```

4. User process blocks on a `read` call on `fd`.
5. Kernel returns a whole link-layer packet when a satisfying one arrives.
