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

Our discussion would be frivolous if the literal content of those compressed object files is not shown:

```sh
# file 00/2ba6aeb01bfb02baacccfd0bbe45825f11bb17 
00/2ba6aeb01bfb02baacccfd0bbe45825f11bb17: zlib compressed data
```

Unfortunately, decompressing a DEFLATE zlib archive from the command line is still cumbersome as of 2023.
We use the following pipeline to do a hexdump on the  content:

```sh
# printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" | cat - 00/2ba6aeb01bfb02baacccfd0bbe45825f11bb17  | zcat | hexyl

┌────────┬─────────────────────────┬─────────────────────────┬────────┬────────┐
│00000000│ 74 72 65 65 20 34 30 35 ┊ 00 31 30 30 36 34 34 20 │tree 405┊⋄100644 │
│00000010│ 2e 67 69 74 69 67 6e 6f ┊ 72 65 00 4b 39 6c 81 0a │.gitigno┊re⋄K9l×_│
│00000020│ d0 e0 8e 65 36 32 be 6f ┊ d9 fb e3 8c 75 d0 44 31 │×××e62×o┊××××u×D1│
│00000030│ 30 30 36 34 34 20 2e 67 ┊ 69 74 6d 6f 64 75 6c 65 │00644 .g┊itmodule│
│00000040│ 73 00 4a 1a 92 49 a1 b4 ┊ 26 81 74 84 99 34 e1 91 │s⋄J•×I××┊&×t××4××│
│00000050│ b4 b0 ba 92 89 d3 34 30 ┊ 30 30 30 20 2e 76 73 63 │××××××40┊000 .vsc│
│00000060│ 6f 64 65 00 fe b4 1c d0 ┊ 04 aa a0 db 12 be ae 1f │ode⋄××•×┊•×××•××•│
│00000070│ 9c 61 1e 60 bc 7d ec 66 ┊ 34 30 30 30 30 20 61 72 │×a•`×}×f┊40000 ar│
│00000080│ 63 68 65 74 79 70 65 73 ┊ 00 f5 b1 aa 13 65 4d 36 │chetypes┊⋄×××•eM6│
│00000090│ 07 71 df 3d a9 82 96 ac ┊ 95 8d 53 7d 88 31 30 30 │•q×=××××┊××S}×100│
│000000a0│ 37 35 35 20 62 61 63 6b ┊ 75 70 2e 73 68 00 d1 0d │755 back┊up.sh⋄×_│
│000000b0│ 67 6d a0 b5 88 bf 79 09 ┊ aa ff cd 2a c5 bb fb 1a │gm××××y_┊×××*×××•│
│000000c0│ e7 bd 31 30 30 36 34 34 ┊ 20 63 6f 6e 66 69 67 2e │××100644┊ config.│
│000000d0│ 74 6f 6d 6c 00 7c 16 22 ┊ 26 6a b2 c2 72 3c 3e 04 │toml⋄|•"┊&j××r<>•│
│000000e0│ 34 a6 66 37 ee 5d 95 b3 ┊ cd 34 30 30 30 30 20 63 │4×f7×]××┊×40000 c│
│000000f0│ 6f 6e 74 65 6e 74 00 9d ┊ 53 91 db b5 81 b2 25 e8 │ontent⋄×┊S×××××%×│
│00000100│ 53 2a 61 af 5b ab d7 e2 ┊ d1 b6 f8 31 30 30 37 35 │S*a×[×××┊×××10075│
│00000110│ 35 20 67 70 2d 64 65 70 ┊ 6c 6f 79 2e 73 68 00 1a │5 gp-dep┊loy.sh⋄•│
│00000120│ e0 b4 41 5c e2 97 cb 3f ┊ 20 5b f9 a4 90 83 34 4b │××A\×××?┊ [××××4K│
│00000130│ 02 d9 cb 31 30 30 37 35 ┊ 35 20 73 65 72 76 65 72 │•××10075┊5 server│
│00000140│ 38 30 38 30 2e 73 68 00 ┊ ce 7b 77 49 77 39 47 50 │8080.sh⋄┊×{wIw9GP│
│00000150│ ba f2 6d e7 d8 ea a2 d0 ┊ 45 f0 f0 f9 34 30 30 30 │××m×××××┊E×××4000│
│00000160│ 30 20 73 74 61 74 69 63 ┊ 00 91 cc ea 8c 5a 86 1b │0 static┊⋄××××Z×•│
│00000170│ e0 b0 14 ad 8d 1c b4 91 ┊ eb 0a 11 82 55 34 30 30 │××•××•××┊×_•×U400│
│00000180│ 30 30 20 74 68 65 6d 65 ┊ 73 00 f8 32 07 84 5c 96 │00 theme┊s⋄×2•×\×│
│00000190│ 77 55 89 54 fb 4b b8 32 ┊ 8a c7 4c e2 c5 e7       │wU×T×K×2┊××L×××  │
└────────┴─────────────────────────┴─────────────────────────┴────────┴────────┘
```



## Git's use of the object store