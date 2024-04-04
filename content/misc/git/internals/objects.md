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
