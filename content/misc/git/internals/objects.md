---
title: "Git Internals: Object Storage"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

At the bottom of git is a storage subsystem that keeps objects,
referred to by some authors as the *content-addressable filesystem* layer.

There are 4 types of objects:

1. blob: the actual file content
2. tree: the directory layout at a given commit
3. commit: 
4. annotation (a.k.a tag):

To pretty print a object file, use

```bash
git cat-file -p <object-hash>
```

This article will delve into this subsystem, explore methods to interact with it and
elucidate its role in supporting Git's primary function as a version management system.

## The Object Storage Layer

The object storage layer is highly decoupled from the business logic of Git which manages versions.
It simply accepts read and write requests of objects. Think about a hash map persisted to the hard drive.
One can interact with the object storage and store arbitrary data in it 
without performing high-level SCM operations like commit or checkout.

An object is a binary file located under the `.git/objects` directory.
This is what the directory normally looks like:

```
.git/objects/
├── 00
│   └── 2ba6aeb01bfb02baacccfd0bbe45825f11bb17
├── 03
│   └── 5c03ced937cba44fa40ed0a0b994fac549f589
├── 09
│   └── e1e2262431a37e624c7622f1aa76f99ee8ac22
├── 0d
│   └── 13b5a62f4ed0230fa24b6c741a3a1d0c94634f

...

├── info
└── pack
    ├── pack-45a38f439c284c7417a828ef3111a47f997e7b3f.idx
    ├── pack-45a38f439c284c7417a828ef3111a47f997e7b3f.pack
    └── pack-45a38f439c284c7417a828ef3111a47f997e7b3f.rev
```

These files are compressed with `zlib` level-1 DEFLATE (i.e. start with magic `0x78 0x01`),
and are structured by directories according to their SHA1 hashes. 

A few things to note:
1. SHA1 result is 20 bytes long i.e. 40 hex digit characters. The first 1 byte (2 chars) is used as the directory name, leaving the rest 19 bytes (38 chars) as the file name. See [this gist](https://gist.github.com/masak/2415865) for an explanation of the precise bytes that are fed into SHA1.
2. `info` directory ... --TODO--
3. `pack` directory holds triplets of archive files `pack-<hash>.{idx,pcak,rev}`. We will discuss these 3 files later.

