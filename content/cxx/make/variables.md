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


There are 4 ways variables are introduced to make runtime context, in the decreasing order of precedence:
1. in Makefile text with `override` directive. (`6.7 The override Directive`)
2. as arguments of `make` CLI invocation (`9.5 Overriding Variables`)
3. in Makefile text (`6.5 Setting Variables`)
4. inherit variables from parent `make`
   1. `export`-ed variable from parent Makefile
   2. 
5. load from OS env vars (`6.10 Variables from the Environment`)

    Every environment variable to the `make` process is made a `Makefile` variable.
    This behavior is the basis of sub-make where parent make must pass `export`-ed variable to sub-make, via adding env var.
    See [submake]({{<ref "./submake.md">}}) for details.

    The only exception is the `SHELL` envvar which normally presented in various shells to declare the shell executable location.
    Make ignore the `SHELL` envvar. A special makefile variable `SHELL` means what shell to use to execute each recipe.

    > Thus, by setting the variable `CFLAGS` in your environment, you can cause all C compilations in most makefiles to use the compiler switches you prefer.This is safe for variables with standard or conventional meanings because you know that no makefile will use them for other things. (Note this is not totally reliable; some makefiles set CFLAGS explicitly and therefore are not affected by the value in the environment.)

    When `make -e` is used, OS envvars takes highest precedence, though such practice is not recommended.

Use the `$(origin var)` function to check in which way a variable is defined.

### Via command line
