---
title: "GNU findutils"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- GNU
- Linux
---

### expression precedence matter

```sh
# only Kbuild* files
find -name 'Makefile*' -o -name 'Kbuild*'  -exec echo {} +

# Makefiles* and Kbuild*
find \( -name 'Makefile*' -o -name 'Kbuild*' \) -exec echo {} +
```

### CLI argument length limit imposed on `-exec command {} +`

`find ... -exec command {} +` aggregates all found file names into a single string, fork-exec a `command` program, and pass the string to the `argv[]` array.
The `argv[]` array on Linux resides near the highest address in the stack VMA (together with the environment variable array and the auxiliary vector), thus there is a size limit on how long the string can be.

https://serverfault.com/questions/163371/linux-command-line-character-limit

getconf ARG_MAX
