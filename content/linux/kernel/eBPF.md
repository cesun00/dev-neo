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

From kernel's perspective, all `struct enfilter` instances form a chain ordered by priority. The `enf_Filter[]` array contains a script for a stack VM.

When a new packet arrives, after executing the filter command list, a nonzero value (true) left on top of the stack (or an empty stack) causes the incoming packet to be accepted for the corresponding packet filter file and a zero value (false) causes the packet to be passed through the next packet filter.

## The Berkeley Packet Filter (BPF)

Steven McCanne and Van Jacobson, while working on the original `tcpdump` program for BSD around 1988, was bothered by the performance of DIGITAL UNIX Packet Filter.

They proposed a new mechanism in 1992 known as the Berkeley Packet Filter (Berkeley from B of BSD), whose workflow is as follows:

1. Admin creates the single `/dev/bpf` character device file.

    > The device /dev/bpf is a cloning device, meaning you can open it multiple times.

2. User process `open(2)` this file and get an int `fd`. It can be opened multiple times, and each `fd` represents a different *open instance* of BPF.
3. User process calls `ioctl(fd, BIOCSETIF, struct ifreq*)`, where `ifreq->ifr_name` gives the interface name, to set an underlying network interface that this filter will operate on. Since then, the file descriptor `fd` is said to be *listening on* that network interface.
4. (Optional) User process call `ioctl(fd, BIOCSETF, struct bpf_program*)` to set the *read filter* of the open instance represented by `fd`.
5. (Optional) User process call `ioctl(fd, BIOCSETWF, struct bpf_program*)` to set the *write filter* of the open instance represented by `fd`.
   
   A `struct bpf_program` instance is simply a list of bpf instructions. Priority is not a thing anymore.

    ```c
    struct bpf_program	{
        u_int bf_len;
        struct bpf_insn *bf_insns;  
    };
    ```

6. User perform `read` from / `write` to a `fd`
   1. `read` only returns incoming and outgoing link-layer packets that satisfy the read filter
   2. `write` only pushes a packet on wire if it satisfies the write filter.

From the kernel's perspective, when a link layer packet arrives at an interface, kernel check all bpf open instances `fd`s that listen on that interface.

Jacobson et.la claimed that BPF is 20 time faster than the old one in DIGITAL UNIX thank to the register-based VM design.

## Linux Socket Filtering (LSF) & eBPF

Linux provides a mechanism similar to BPF since 2.2 (Jan 1999), but branded it as Linux Socket Filtering (LSF) to get rid of "Berkeley".

Instead of attaching a filter to a network interface, Linux's design is to attach filter to an existing socket, so you don't need opening `/dev/*` stuffs anymore:

1. User process creates `socket(2)` and get an int `fd` (can be `AF_INET` / `AF_PACKET` / etc)
2. User process code its BPF program as a `struct sock_fprog`

```c
/* example: 
    tcpdump -i enp6s0 port 22 -dd 
    recv only return incoming and ougoing packet at TCP/UDP port 22
*/
struct sock_filter code[] = {
        { 0x28,  0,  0, 0x0000000c },
        { 0x15,  0,  8, 0x000086dd },
        { 0x30,  0,  0, 0x00000014 },
        { 0x15,  2,  0, 0x00000084 },
        { 0x15,  1,  0, 0x00000006 },
        { 0x15,  0, 17, 0x00000011 },
        { 0x28,  0,  0, 0x00000036 },
        { 0x15, 14,  0, 0x00000016 },
        { 0x28,  0,  0, 0x00000038 },
        { 0x15, 12, 13, 0x00000016 },
        { 0x15,  0, 12, 0x00000800 },
        { 0x30,  0,  0, 0x00000017 },
        { 0x15,  2,  0, 0x00000084 },
