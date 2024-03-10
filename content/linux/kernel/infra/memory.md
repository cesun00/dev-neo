---
title: "The kernel memory allocator"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- Linux
- kernel
---

mm/slab.h
/home/bitier/pack/linux/linux-6.8.2/mm/slub.c

SLUB: A slab allocator that limits cache line use instead of queuing
 * objects in per cpu and per node lists.

kmem_cache_alloc_node

kmem_cache_free