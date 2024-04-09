---
title: "Weak Symbol & Global Symbol Interpolation in ELF"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

This article explains how the `STB_WEAK` value of `ST_BIND` how such a symbol works.

## for static linked objects

During the static linking stage:
1. multiple global (a.k.a strong) symbols of the same name during the causes a `multiple definition` error.
2. a unique global symbol and one or more weak symbol(s) of the same name, the definition of the global symbol is used
3. mroe weak symbol(s) of the same name and no global symbol, the first weak symbol definition appear in the ordered input to the linker win.
3. one weak symbol, no global symbol, the weak is used.

## for dynamic linked objects

During the static linking between `main.o` and shared objects
1. multiple strong symbol doesn't trigger an error. The first `.so` that provides a the symbol definition is linked against (i.e. write into `ldd` required SO)


```asm
global foo:weak;
```
