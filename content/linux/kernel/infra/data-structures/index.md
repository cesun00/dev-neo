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

{{<figure src="./list_head.png" caption="[(credit)](https://www.byteisland.com/linux-%E5%86%85%E6%A0%B8%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/)">}}

{{<columns>}}

A quick demo will give you more context:

```c
#include <linux/list.h>

extern void* malloc(size_t);
extern void exit(int);
extern int printf(const char *fmt, ...);
extern int puts(const char *fmt);

struct foo {
    int data;
    struct list_head link_node;
    int data2;
};


struct foo *create_foo(){
    struct foo *ret = malloc(sizeof(struct foo));
    if (ret == NULL) {
        puts("fucked");
        exit(1);
    }
    static int counter = 0;
    ret->data = 42+counter;
    counter++;
    return ret;
}


int main() {
