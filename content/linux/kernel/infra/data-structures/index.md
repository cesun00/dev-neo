---
title: "Kernel Data Structures"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- Linux
- kernel
---

Some pervasive data structures in the Linux kernel code are discussed.

<!--more-->

## `struct list_head`: Bi-Directional Circular Linked-List

`struct list_head` is declared in `include/linux/types.h`:

```c
// include/linux/types.h

struct list_head {
	struct list_head *next, *prev;
};
```

This strange linked-list node has no data field. To use it, you need to:
1. embed `struct list_head` in your business structure;
2. hold a bare `struct list_head` instance externally (the guardian head), usually at global scope.
  This special instance is the representation of the list. Many APIs described below take a `struct list_head` in the signature but the argument must be this special head node, instead of being an arbitrary `struct list_head` instance.

