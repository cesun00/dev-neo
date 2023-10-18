---
title: "DNS as a general-purpose KV store: Model and Design"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---



<!-- DNS is a service that maps a triplet `(dot-segmented string, net, type)` to an arbitrary byte sequence.
When `net=Internet`, some of  -->

This article gives an overview of the design of the Domain Name System.

## The Hierarchical Name Space & Domains

In the center of the Domain Name System is the idea of a tree of names, known as the hierarchical namespace.

```goat
                            (empty string)
                                   |
                                   |
             +---------------------+------------------+
             |                     |                  |
            MIL                   EDU                ARPA
             |                     |                  |
             |                     |                  |
       +-----+-----+               |     +------+-----+-----+
       |     |     |               |     |      |           |
      BRL  NOSC  DARPA             |  IN-ADDR  SRI-NIC     ACC
                                   |
       +--------+------------------+---------------+--------+
       |        |                  |               |        |
      UCI      MIT                 |              UDEL     YALE
                |                 ISI
                |                  |
            +---+---+              |
            |       |              |
           LCS  ACHILLES  +--+-----+-----+--------+
            |             |  |     |     |        |
            XX            A  C   VAXA  VENERA Mockapetris   
```

<!-- credit: https://www.rfc-editor.org/rfc/rfc1034.html -->

Each node on the tree is assigned a *label*, e.g. `edu`, `mit`, etc.
The label of the root node is `""`, an empty string, a.k.a the null label.

> Each node has a label, which is zero to 63 octets in length. Brother
> nodes may not have the same label, although the same label can be used
> for nodes which are not brothers.  One label is reserved, and that is
> the null (i.e., zero length) label used for the root.

To uniquely identify a node `x` in the tree, people concatenate the label on the path from `x`
all the way back to the root node, separated by a dot - a syntax known as the *domain name*.

> The domain name of a node is the list of the labels on the path from the
> node to the root of the tree.  By convention, the labels that compose a
> domain name are printed or read left to right, from the most specific
> (lowest, farthest from the root) to the least specific (highest, closest
> to the root).

The fact that the root node has a null label has several implications:
1. When a user needs to type a domain name, the last character will be a dot (the one separates a TLD the empty string)
2. The [length-prefixed binary encoding](TODO{{<ref "">}}) of domain names used in DNS messages always ends with a `null` byte, indicating the zero-length null label.

The term *domain* when used alone refers to the whole subtree rooted at a node identified by a domain name.

RFC1034 requires that all programs that manipulate domain names treat them in a case-insensitive manner,
and preserve their cases when possible. In real life this means


// ----------


For example, these are domain names:

```
org
com
wikipedia.org
example.com
```


## Glossary

- zone: a collection of authoritative RRs. Zone are the unit of information exchange between master and slave server. Zone are stored as zone file in the master server, and synchronized to the slave NS perodically.

> Authoritative information is
     organized into units called ZONEs, and these zones can be
     automatically distributed to the name servers which provide
     redundant service for the data in a zone.

- domain: a node on the namespace. This is conceptual.


- domain name: A domain name uniquely identifies any node in the DNS tree and is written, left
to right, by combining all the domain labels

- fully qualified domain name (FQDN):

    these are FQDN:

    ```
    wikipedia.org.
    example.com.
    ```

## , the Hierarchical Authoritative NS, and the Zone

DNS, the *Domain Name* System, requires `name` to exhibit a dot-segmented structure rather than being an arbitrary string, and there is a reason.

Each segment is known as a *label*, and labels of all existing domain names naturally form a tree structure, known as the hierarchical name space.
This tree structure corresponds to the organizational hierarchy of human society, meaning that for any given suffix, there is a concrete organization or person that administrates (at least) the first-level mapping under that suffix. Such entity publishes the official mapping via name servers in their control, becoming *authoritative name servers*. Authoritative name servers are the single source of truth for the mapping.

To query the authoritative name servers

2. An organization that administrates a given suffix controls the mapping , but may or may not controls 2 level.

Keep this tree model in mind since many vocabularies in the DNS specification are based on this model.
Again not all elemetns of this model turns out to be significant, making this specification even more pedantic.

1. The total number of names (or, to be precise, mappings) across the globe can be huge to reside on a single disk. There must be some structure within `name` that allows division of storage.
2. The maintenance cost where a monolithic organization be the authority of all `name`s and accepting requests to update mappings can be prohibitive. There must be some structure within `name` that allows division of administration.

## Referencing

## interfaec

Logically, DNS is a service that maps from `(name, qtype, qclass)` triplet to a set of *resource records (RRs)*.

For example, `('ns3.dnsv5.com.', A, IN)` maps to a list of A records with the following IP addresses on the Internet:

```
ns3.dnsv5.com.	172800	IN	A	1.12.0.17
ns3.dnsv5.com.	172800	IN	A	1.12.0.18
ns3.dnsv5.com.	172800	IN	A	1.12.0.20
ns3.dnsv5.com.	172800	IN	A	1.12.14.17
ns3.dnsv5.com.	172800	IN	A	1.12.14.18
ns3.dnsv5.com.	172800	IN	A	108.136.87.44
ns3.dnsv5.com.	172800	IN	A	125.94.59.200
ns3.dnsv5.com.	172800	IN	A	163.177.5.75
ns3.dnsv5.com.	172800	IN	A	35.165.107.227
```

- `name` must be a string of dot-separated segments, a syntax known as the domain name. 
- `qtype` specifies the *type of RRs* to query.

    The authoritative definition of RR types is maintained at https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4.

    Common values are `A` for RRs that represent an IPv4 address, or `MX` for RRs that represent the email address of the admin of this domain name.

- `qclass` specifies the *class of service* to query.
    
    The class of service determines the semantics of DNS mapping service.

    The authoritative definition of class of service values is maintained at https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-2.

    DNS, when queried for `qclass=Internet (1)`, maps domain names to information related to that domain.
    Historically, some projects used DNS as a general database functionality to serve information that changes infrequently.
    e.g. Hesiod project used `qclass=Hesiod (3)` and delivery Unix `/etc/passwd` and `/etc/group` information via DNS.

    This field is largely obsolete since DNS nowadays is queried sorely for Internet hosts' information.




// ----------


- Authoritative Name server Hirarchy:

    Such server will:
    1. respond with `AA=1` for
    2. respond with *referral*

    - . The answer to the resolver’s QUESTION in the ANSWER section of the query response.
    - 2. A referral (indicated by an empty ANSWER section but data in the AUTHORITY section, and typically IP addresses
    - in the ADDITIONAL section of the response).
    - 3. An error (such as NXDOMAIN - the name does not exist).

- (caching) resolver:

    These type of components

    - full-service resolver / recursive resolver: a name server that is willing to accept `RD=1` query and iteratively sends multiple queries to the DNS hierarchy until the answer is obtained on behalf of a client.

        The resolver always starts with root servers and sends an iterative query (4, 5, and 6).

    - forwarding resolver: a name server that is willing to accept `RD=1` query but simply forward the query to a full-service resolver. This is useful in scenarios like a organization's intranet where a single forwarding resolver is deployed. All users in the intranet use this DNS, reducing total outbound network requests as well as easing the maintanance.
    - stub resolvers: these are programs on an end-user's PC that send `rd=1` to an real dns server. Instead of accepting anything, they are more likely to accept library call from applications. Example being the GLIBC builtin DNS implementation, which respect the `/etc/resolv.conf` config file.

    Not knowning these terms doesn't stop you from being a good DNS admin, but it's good to know the difference.



Generically, the authoritative NS of suffix `foo.bar`

## the problem

Authorittaive server and zone transfer could use complete different protocol other than sharing the same DNS message format  (and there are good reasons are... )