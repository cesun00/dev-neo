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

### `list_head` APIs Synopsis

First, the special head node. It can be defined (at global or function lexical scope) by:

```c
LIST_HEAD(foo_list_head);
// expands to
struct list_head foo_list_head = LIST_HEAD_INIT(foo_list_head);
// expands to
struct list_head foo_list_head = { &foo_list_head, &foo_list_head}; // i.e. both next and prev points to self, indicating an empty list
```

The `static` keywords can be applied as appropriate.
Since such declaration can appear in both the global scope and the function scope, the semantics of `static` differs as it does in ordinary C.

`LIST_HEAD_INIT` can be used independently to initialize an existing list as long as you know the expansion result is valid syntax:

```c
struct apei_resources {
	struct list_head iomem;
	struct list_head ioport;
};

// instantiated like

static struct apei_resources apei_resources_all = {
	.iomem = LIST_HEAD_INIT(apei_resources_all.iomem),
	.ioport = LIST_HEAD_INIT(apei_resources_all.ioport),
};

// or 

static struct list_head ptable_list[2] = {
	LIST_HEAD_INIT(ptable_list[0]),
	LIST_HEAD_INIT(ptable_list[1]),
};
```

- When defining as a global variable, the 2 macros above induce static initialization, which can be a very interesting topic since we are in kernel code.
<!-- TODO: LINUX KERNEL STATIC INIT ORDER? -->

There is a third function:

```c
static inline void INIT_LIST_HEAD(struct list_head *list)
{
	WRITE_ONCE(list->next, list);
	WRITE_ONCE(list->prev, list);
}
```

that can be convenienct when you obtain a pointer to head from somewhere else. (TODO)
See [infra/](#TODO) for how `WRITE_ONCE` works.
<!-- It reset an existing `struct list_head` instance (pointed) as the head of a new empty linked list.
It's useful  -->


- 
The linked-list based on `struct list_head` is not type safe: having a known `struct list_head` instance,
You have to correctly cast

```c
struct foo_struct *curr = /* a known instance*/;

// get the next instance in the linked list:
struct foo_struct *next = list_next_entry(curr, bar_list);
struct foo_struct *next = list_entry(&curr->bar_info->next, struct foo_struct, bar_info);
```

`struct list_head` is a bi-directional circular linked-list that
1. its not type safe. Each element can have arbitrary. Using an element requires correctly casting its type via `

`list_entry()` is a macro that expands to an expression when evaluated gives 

```c
/**
 * list_entry - get the struct for this entry
 * @ptr:	the &struct list_head pointer.
 * @type:	the type of the struct this is embedded in.
 * @member:	the name of the list_head within the struct.
 */
#define list_entry(ptr, type, member) \
	container_of(ptr, type, member)
```

## `hlist_head` and `hlist_node`: 

Operation on those data structure are declared in `include/linux/list.h`:


```
struct hlist_head {
	struct hlist_node *first;
};

struct hlist_node {
	struct hlist_node *next, **pprev;
};
```