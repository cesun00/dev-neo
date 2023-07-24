---
title: "GNU grep failed to `--invert-match` a Perl regex (`-P`) matching result"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- regex
- grep
- linux
---

To `grep` non-comments from the following input:

```c
/*
foo
*/

bar


/*
foo
*/

bar
```

`grep -v -Pzo '(?s)(/\*.*?\*/)' test.txt`