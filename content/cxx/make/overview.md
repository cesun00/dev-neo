---
title: "Makefile Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - GNU
    - make
    - Makefile
---

The `Makefile` language can be divided into 2 parts, a dependency description language,
and a scripting language including constructs like functions, variables, loops, branching etc.

The purpose of the scripting part of a Makefile is to
1. determine the value of variables at run time, which can be expanded in the dependency part.
2. conditionally enable or disable certain rules in the dependency part

The mixture of 2 languages in the same `Makefile` renders it a rather weird creature for beginners.

## include other makefiles

The `include` and `-include` directive instructs the parser to parse the mentioned files as if their content replaces the `include` directive. (Not really, see below.) The parsing of the current file is paused until the replacement is done. There is no more ad-hoc treatment.

This indicates that the paths (including targets and dependencies) within the `include`-ed files are interpreted relative to the CWD of the `make` process that is parsing the `include`-ing Makefile.

```makefile
# Multiple files can appear in the same directive, order respected.
# wildcard works
include Makefile.other foo *.mk $(bar)

# the `-include` variant won't cause an error if mentioned files is not found
# Read auto.conf if it exists, otherwise ignore
-include include/config/auto.conf
```

If the specified file name does not start with a slash (i.e. a relative path),
- it is located relative to the CWD; if not found,
- it is searched in the directories given by the `.INCLUDE_DIRS` variable, which is populated by
    1. path supplied by the `-I` option
    2. path hardcoded into the `make` program at its build time

Eventually,
1. If the included file is found, its current content is read (which may contain rules to remake itself), without immediately considering its up-to-date-ness;
2. If the included file is still not found, it's not immediately an error. In some workflow, the Makefile is generated from some other source.

Once Make has finished reading Makefiles, it will try to remake any that are out of date or don't exist.
Make will raise a fatal error only after no rule is found to remake a non-existing Makefile.
This means Make needs to distinguish between files, instead of simply replacing `include` with the file content.

In the following example from the Linux kernel, the rules to remake `include/config/auto.conf` and `include/config/auto.conf.cmd` will be triggered before including these 2 files if the `$(KCONFIG_CONFIG)` (expands to `.config`) file has been modified after the previous generation of these 2 files.

```makefile
include include/config/auto.conf
include include/config/auto.conf.cmd

%/config/auto.conf %/config/auto.conf.cmd %/generated/autoconf.h %/generated/rustc_cfg: $(KCONFIG_CONFIG)
	$(Q)$(kecho) "  SYNC    $@"
	$(Q)$(MAKE) -f $(srctree)/Makefile syncconfig
else
```

<!-- ----------------------------------------------------------------------------------------------------------------------------- -->

A `Makefile` contains the following of constructs:

{{<boldlist>}}

1. explicit rules

    See...

2. condition structures

2. variable definitions

    A variable definition is a line that specifies a text string value for a variable that can be substituted into the text later.

4. directives

    A directive is an instruction for make to do something special while reading the makefile, including:

    1. Merging the content of another Makefile into the current one (see TODO).
    2. Conditionally use or ignore a part of the Makefile based on the values of variables (see Conditional Parts of Makefiles).
    3. Defining a variable from a verbatim string containing multiple lines (see Defining Multi-Line Variables).

5. comments

    Anywhere in a line, `#` till the next line feed is a comment, except that `\<LF>` can break a comment line as well.

    **Comments are not always ignored:**

    1. Comments within a recipe are passed to the shell, just as with any other recipe text. The shell decides whether this is a comment.
    2. Within a `define` directive, comments are not ignored during the definition of the variable, but rather kept intact in the value of the variable. When the variable is expanded they will either be treated as make comments or as recipe text, depending on the context in which the variable is evaluated.

{{</boldlist>}}

## Recipe Execution

For each logical line, make forks an isolated shell to execute the text on that line.


## Makefile

### Wildcards

Wildcards characters `*`, `?` and `[…]` are supported in 3 context:

- in the target and prerequisite line, wildcards are natively supported by GNU make;
    - In this context, a subtle problem is that, like shell globbing, patterns text like `*.c` are preserved literally when no file are matched, which could cause a problem sometimes, e.g. as prerequisite.
- in recipe lines, each recipe are passed to the shell, and wildcard characters' support are up to the shell;
- in all other places, wildcard expansion must be explicitly requested by the `wildcard` function.

To get a literal asterisk or question mark, use `\*` or `\?`.

```makefile
doStuff: *.c        # make expands
    rm *.o          # shell expands

objects = *.o       # NO expansion. `objects` stores '*.o' literally

output: $(objects)  # `$(objects)` substituted by '*.o', then make expands

# to store all object files in `objects`, use
objects := $(wildcard *.o)      # note the := syntax means to expand RHS immediately
```

### Patterned target & patterned dependency

```makefile
# a rule that are selected for all `make *.c` 

%.c: 
    # the actual invoked target is obtained by `$@`

%.o: %c
    # 
```



Collect file names in a variable with `$(wildcard)` and depend on the expanded result of that variable.


### Empty recipe

```
target: ;
```

## Target Execution & Error Handling


### 2 phase execution

