## model

There exist certain nameservers (reachable by their IP address) in some corner of the world that, according to its own configuration file, believes
it is the authoritative NS of certain zone of the domain name space.

###  glosasry

1. logically, a domain is a subtree of the domain name space at a specific root, including that root, that expands down infinitely.
2. a domain (that subtree) is identified by concatenating the labels from root, a syntax known as its *domain name*
3. a domain (the subtree) can itself have subtree, i.e. subdomain
4. a zone is a non-empty set of contagious nodes on the tree, such that a name server believes itself is being authoritative about. There is no global consensus about how zones are divided; such consensus depends on a correct configuration from the administrator. A zone always occupies a whole subtree, even when it only contains a single node.

1. a special ROOTNS is `198.41.0.4`, it's the ANS of a zone of a single node - the `.` root.
2. the ANS of a zone, upon seeing a query about a domain name not in the zone, but is a subdomain of a node in that zone, should be able to generate a correct DNS referral.

## response

For any query, the response by the name server either
1. answers the question posed in the query,
2. refers the requester to another set of name servers, or 

    The Authority section was originally designed only for this purpose. 
    However, later modification of `bind9` (thus RFC1034) allows the Authority section to contain SOA RR as well when
    1. CNAME is returned in the answer section.
    2. 

3. signals some error condition.

## ns record

NS records are properties associated with the zone, instead of with a particular node in the zone.

But they have to be configured in the zone file in the format of a textual RR, so they must also 
have an owner node, which must be `@` (the current `$ORIGIN`), i.e. the root node.

Writing a NS RR for a owner that is not `@` is the syntax of subzone delegation, and will cause that NS RR to be returned in the Authority section. (you also want to configure an A/AAAA record for the RDATA name of that NS RR).

RFC 1035:
> @A free standing @ is used to denote the current origin.

## CNAME

>  A CNAME RR identifies its owner name as an alias, and specifies the corresponding canonical name in the RDATA section of the
RR.
> ****If a CNAME RR is present at a node, no other data should be present;****
> this ensures that the data for a canonical name and its aliases cannot be different.
> This rule also insures that a cached CNAME can be used without checking with an authoritative server for other RR types.