---
title: "Makefile as a Dependency Description Language"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- Linux
- GNU
- Makefile
- Make
---

- https://www.gnu.org/software/make/manual/html_node/Double_002dColon.html
- https://www.gnu.org/software/make/manual/html_node/Remaking-Makefiles.html

The `Makefile` language can be divided into 2 parts, a dependency description language,
and a scripting language including constructs like functions, variables, loops, branching etc.

This article discusses everything about the Dependency Description ability of a Makefile.
See [TODO](#TODO) for the scripting part.

<!--more-->

## (Explicit) Rules

The unit of dependency description is *explicit rules* (often, just *rules*). A rule has the following syntax:

```makefile
# each structure below is named a "rule"
target: prerequisites
    recipe

# e.g.
foo.o: foo.c
        $(CC) -Iinclude/ -Iarch/x86/include foo.c
```

An explicit rule describes when and how to remake one or more files, called the rule’s targets. It lists the other files that the targets depend on, called the prerequisites of the target, and may also give a recipe to use to create or update the targets.

### the File nature of target

An important assumption in the design of make and Makefile is that: target names are file names.
- 
- This is not always true, as `make all` is invoked from the command line

Targets that are meant to be invoked directly on the command line by the end users are called *goals*.
When `make` is invoked without a goal, a default goal will be invoked: it is the value of special variable `.DEFAULT_GOAL`, or if omitted, the first target whose name doesn't start with `.`.

{{<card "warn">}}

Rules are called explicit if they are present in a `Makefile`, as opposed to *implicit rules* (or sometimes *built-in rules*).

GNU Make attempts to use the following rule 
when `make foo.o` is requested (or used as a dependency) and a `foo.c` file exists, but no rule of making `foo.o` presents in the Makefile:

```makefile
foo.o:
	$(CC) -c foo.c
```

Similarly, a few other implicit rules are hardcoded for other suffixes, e.g. a `bar.c` file from a `bar.l` (lex source) file.
See [the manual page](https://www.gnu.org/software/make/manual/html_node/Catalogue-of-Rules.html) for an exhaustive list.

Implicit rules are active *even when no `Makefile` exists*. Type `make main.o` in a directory with `main.c` and no `Makefile` and see what happens.

Users can change the value of the variable `CC`, thus changing the compiler used by such implicit rules.
Such variables are known as built-in variables.

**Implicit rules and builtin variables won't be discussed in this series.** They are legacy features, whose functionality can be completely superseded by using [patterned rules](#patterned-rules). It is strongly suggested to disable them at the beginning of a `Makefile` by (code from Linux Kernel):

{{<fold>}}

```makefile
ifneq ($(sub_make_done),1)TODO

# Do not use make's built-in rules and variables
# (this increases performance and avoids hard-to-debug behaviour)
MAKEFLAGS += -rR

# if you are using GNU Make 4.0 (released in Oct 2013), ignore the following

ifneq ($(filter 3.%,$(MAKE_VERSION)),)
# 'MAKEFLAGS += -rR' does not immediately become effective for GNU Make 3.x
# We need to invoke sub-make to avoid implicit rules in the top Makefile.

need-sub-make := 1
endif


ifeq ($(need-sub-make),1)

PHONY += $(MAKECMDGOALS) __sub-make

$(filter-out $(this-makefile), $(MAKECMDGOALS)) __all: __sub-make
	@:

