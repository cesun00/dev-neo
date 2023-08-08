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
    LIST_HEAD(precious_head);
    struct foo *somefoo[3] = {
        create_foo(),
        create_foo(),
        create_foo(),
    };
    list_add_tail(&somefoo[0]->link_node, &precious_head);
    list_add_tail(&somefoo[1]->link_node, &precious_head);
    list_add_tail(&somefoo[2]->link_node, &precious_head);

    struct foo *cur;
    list_for_each_entry(cur, &precious_head, link_node) {
        printf("%d\n", cur->data);
    }
    return 0;
 }

```

<--->

To compile this code, first build the kernel (e.g. with `make defconfig`) for the generated headers, then:

```makefile
# replace with your source tree root
LINUX_SRC_ROOT:=$(realpath ..)

a.out: main.c
	gcc -D__KERNEL__ \
		-I$(LINUX_SRC_ROOT)/arch/x86/include/generated  \
		-I$(LINUX_SRC_ROOT)/arch/x86/include/ \
		-I$(LINUX_SRC_ROOT)/include/generated \
		-I$(LINUX_SRC_ROOT)/include/ \
		main.c
```

{{</columns>}}

