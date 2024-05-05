---
title: "Overview to The Netwide Assembler"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- nasm
- assembly
- x86
---

NASM is an assembler for x86 and AMD64 architecture.

## CLI invocation

```sh
nasm -f FORMAT -o OUTPUT_FILE source.asm
```

`nasm` assembles each `.asm` file to an object file, which is later linked by a linker e.g. GNU `ld`.
See `nasm -h` for a list of supported `FORAMT`. For modern *NIX you almost always want to use `-f elf64`.
If `-o` is not specified,

## Programming

