---
title: "Makefile Variables"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - GNU
    - make
    - Makefile
---


## Define variables

{{<columns>}}

#### the lazy flavor: *recursively expanded variable*

The good old syntax are supported by all ancient `make` programs.

syntax: `foo = RHS`
- Lazy expansion: `foo` stored `RHS` verbatim, without caring what it even is. 
- `foo` expands to `RHS` upon request, and if `RHS` further contains variable reference, it will be recursively expanded.

e.g. The following prints `hello` upon `make`. Notice the text order of variables:

```makefile
foo = $(bar)  # foo stores literal string '$(bar)'
bar = $(ugh)  # bar stores literal string '$(ugh)'
ugh = hello

# recursive expansion happens when evaluating $(foo)
all:
	@echo $(foo)    # 'hello'
```

<--->

#### the greedy flavor: *simply expanded variables*
