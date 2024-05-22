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
