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

Require modern `make` implementations. Mandated by POSIX 2012.

Both syntax are equivalent in GNU make:
`foo := RHS` (GNU specific), or `foo ::= RHS` (POSIX)

- Expansion of `RHS` happens immediately; if `RHS` further contains variable reference, it will be recursively expanded.
- `foo` expands to result of `RHS` expansion upon request.

```makefile
x := foo
y := $(x) bar   # expansion happen right now: y stores 'foo bar'
x := later

all:
	@echo $(y)		# foo bar
```

{{</columns>}}





Variable name cannot contain `:`, `#`, `=`, or ` ` (the 0x20 whitespace).

GNU make documentation recommends that:
1. use only letters, numbers and underscore for variable name for compatibility with certain shells.
2. not use variable names beginning with `.` and an uppercase letter. Those may be assigned with special semantics in future release of GNU make.

Case convention:
1. lower case variables name for internal usage
2. uppercase for parameters that
    - control implicit rules, or
    - user should override
