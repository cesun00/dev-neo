---
title: "Make (unclassified)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- Make
- GNU
---

##  Make will always try to remake the Makefile before executing the Makefile

https://stackoverflow.com/questions/4266281/makefile-adds-itself-as-target

https://www.gnu.org/software/make/manual/html_node/Remaking-Makefiles.html


## `Makeconfig`, `Makerules`, and `Maketargets` files

glibc uses these files

## Make functions

https://www.gnu.org/software/make/manual/html_node/Functions.html


## directives

- `export vars`: adding `vars` to process env var vector
- `unexport vars`: remove `vars` from process env var vector

## sanitizer

1. clear all envvar before invoking `make`:

```
env -i make
```

2. disable implicit rules and builtin vars

```makefile
# Do not use make's built-in rules and variables
# (this increases performance and avoids hard-to-debug behaviour)
MAKEFLAGS += -rR

# 'MAKEFLAGS += -rR' does not immediately become effective for GNU Make 3.x


# Avoid funny character set dependencies
unexport LC_ALL
LC_COLLATE=C
LC_NUMERIC=C
export LC_COLLATE LC_NUMERIC
```