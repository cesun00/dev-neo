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

A invocation like `make foo=bar all` runs the `all` target with a variable named `foo` having value of `bar`.
All assignments to `foo` originally in the Makefile are ignored, unless it's governed by the `override` directive:

```makefile
override foo := baz     # ignore whatever end user says and use baz
```

### Via explicit Makefile source

(see 3.7 for detailed explain of the expansion / execution phase)

These 2 flavors mainly differs by whether `RHS` is expanded immediately.

### Via OS envvar


Other than being explicitly defined by Makefile text, variable can be introduced from the "environment


## Use Variables

To reference a defined a variable, use either `$(foo)` or `${foo}` syntax, both equivalent.
Use `$$` to escape for a literal `$`.

*Deprecated*: Without parentheses or brace, the character after `$` is always treated as a single-character variable name, e.g. `$foo` is `$f` concated with string `oo`. This causes confusion. Don't do this.



## Automatic Variables


## Variables Used by Implicit Rules (VUIR)


You can cancel all variables used by implicit rules with the `-R` or `--no-builtin-variables` option.

Common ones:

- CC: Program for compiling C programs; default ‘cc’.
    - CFLAGS: Extra flags to give to the C compiler.
- CXX: Program for compiling C++ programs; default ‘g++’.
    - CXXFLAGS: Extra flags to give to the C++ compiler.
- CPP: Program for running the C preprocessor, with results to standard output; default ‘$(CC) -E’
    - CPPFLAGS: Extra flags to give to the C preprocessor and programs that use it (the C and Fortran compilers).
- LDFLAGS: Extra flags to give to compilers when they are supposed to invoke the linker, `ld`, such as -L. Libraries (-lfoo) should be added to the LDLIBS variable instead.

Specifically, note that the static linker `ld` is not one among the list. (Always `ld` thus hardcoded?).


## Special variables

Special variables are ones set by the `make` program itself, rather than set by the user in `Makefile`.
- `MAKE`: this expands to `argv[0]` of the `make` process, i.e. the program name by which `make` is invoked.
    
    It's recommended to use this variable to initiate sub-make, avoids instead of a raw `make`.
    
    There is no other specialty about this variable. It can be override as any other variables.

## Parameterized Variables (Functions)

TODO

## GNUmake-specific special variables

