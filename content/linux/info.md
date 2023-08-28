---
title: "GNU Texinfo"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- Linux
- GNU
- texinfo
---

## warning

The `info` program is not the best tool to read texinfo pages.
Download an HTML build, and use your browser.

<!-- The most fatal problem to me is that there is no way to scroll down without accidentally going to the next node. -->



## info

`info` program reads archive files in its *search path*, which is `/usr/share/info/` for most distros,
and presents them as so-called *files* (in the sense of info's business model) in the `info` TUI.
Note that an info *file* may consist of multiple filesystem files:

```ls
# /usr/share/info $ ls libc.*
libc.info-10.gz  libc.info-14.gz  libc.info-18.gz  libc.info-3.gz  libc.info-7.gz
libc.info-11.gz  libc.info-15.gz  libc.info-19.gz  libc.info-4.gz  libc.info-8.gz
libc.info-12.gz  libc.info-16.gz  libc.info-1.gz   libc.info-5.gz  libc.info-9.gz
libc.info-13.gz  libc.info-17.gz  libc.info-2.gz   libc.info-6.gz  libc.info.gz
```

The term *file* below refers to info's model, instead of filesystem files.

<!-- Files are equal - there is no parent file or child file - things.
To display all files installed on a local machine,  -->

## Prerequisites

All shortcuts in GNU info are shortcuts for a command.
A command can always be executed by typing its name in the `M-x` prompt.

`M-x` itself is a shortcut for the `execute-command` command, which prompts for command input.

## Dual Models: tree and book

Each file can be thought of as a book - a collection of articles each called a node.
There are 2 models `info` use to organize these nodes:
1. 
2. naturally reading order as you go from the first page of a book to the last page.

organized into a tree structure.
Each article is thus called a *node*.
Each where sibling nodes has next and prev links chaining

```
d   goes to the directory node (the parent node of all root node)
```

### Tree mode manipulation

```
t       go to the root node
n       go to the next sibling node
p       go to the prev sibling node
u       go to the parent node
l       go back a node in browsing history, useful when followed hyperlinks and jump back
```

### book mode manipulation

```
[       previous node (in book reading order)
]       next node (in book reading order)
<       first node in the book
>       last node in the book
g       go to a specific node by prompting for node name
```

In-node scrolling:

```
pageup      Scroll 1 screen up in current node. 
```

## Scrolling

- <space> or <PageDown>

    scroll one `n` lines down (n defaults to the height of window), go to the next node if already viewing the end of the current node.

- `M-<number>-x` and type `scroll-forward-page-only-set-window` in the prompt

    like `space` but set `n` to `<number>` for future calls to `scroll-forward` command family

- delete or PageUp

    The going-up counterpart of `space`

