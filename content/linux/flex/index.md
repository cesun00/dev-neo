---
title: "Fast Lexical Analyzer (Flex)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The original `lex` program was written for the UNOS operating system in 1975.
It was a proprietary software under the Bell Laboratories license.
Nowadays open-source versions of `lex` based on the original proprietary code are available.

Flex is the free and open-source alternative to `lex`.

> Vern Paxson took over the Software Tools lex project from Jef Poskanzer in 1982.
> At that point it was written in Ratfor. Around 1987 or so, Paxson translated it into C, and a legend was born :-).

Flex is not part of the GNU project. [There was a period of time Flex and its manual (compiled from `doc/flex.texi`)
were distributed from GNU's ftp server](https://ftp.gnu.org/old-gnu/Manuals/flex-2.5.4/html_mono/flex.html) because
["no one's written a decent GPL'd lex replacement"](https://westes.github.io/flex/manual/Is-flex-GNU-or-not_003f.html#Is-flex-GNU-or-not_003f).

## CLI Invocation

```
flex [options] input.l
```

The `flex` program takes an input file and generates a C99 file named `lex.yy.c` by default.
- Generating non-C99 K&R C code is possible via the `%option noansi-definitions` option, but is deprecated and may be removed in the future.
- Generating a parser in C++ source (with encapsulation as a scanner class) is possible but experimental.

The `lex.yy.c` file can then be compiled, but to link it into an executable or shared object
an `int yywrap (void)` function definition must be provided.
This function should return true (non-zero) or false (zero) depending on
how you want the scanner to behave when the end-of-file is reached.
See below for the detailed semantics.
To get started, you can do either:
1. linking with the `libfl` (by a `-lfl` flag to gcc)

    `libfl` is a tiny library Flex ships which [contains only 2 source files](https://github.com/westes/flex/blob/52c3d81c245f605c0a1129535fb44864d524ac48/src/Makefile.am#L17):
    - [libyywrap.c](https://github.com/westes/flex/blob/master/src/libyywrap.c) provides a dummy `yywrap` definition that always returns `1`.
    - [libmain.c](https://github.com/westes/flex/blob/master/src/libmain.c) provides a `main` function for convenience whose behavior is simply scanning the next token until EOF is reached.

    Linking with `libfl` is particularly convenient if you are testing or prototyping a scanner and feel lazy to write `yywrap` and `main`.

2. Writing one that always returns `1` in the [user code section](#input-file-format). Of course, the responsibility also falls on you to provide a `main` function if you want to create an executable.

```sh
# readelf -s /usr/lib/libfl.so

Symbol table '.dynsym' contains 9 entries:
   Num:    Value          Size Type    Bind   Vis      Ndx Name
     0: 0000000000000000     0 NOTYPE  LOCAL  DEFAULT  UND 
     1: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND _ITM_deregisterT[...]
     2: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND __gmon_start__
     3: 0000000000000000     0 NOTYPE  GLOBAL DEFAULT  UND yylex
     4: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND exit@GLIBC_2.2.5 (2)
     5: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND _ITM_registerTMC[...]
     6: 0000000000000000     0 FUNC    WEAK   DEFAULT  UND [...]@GLIBC_2.2.5 (2)
     7: 0000000000001020    34 FUNC    GLOBAL DEFAULT   10 main
     8: 0000000000001120    10 FUNC    GLOBAL DEFAULT   10 yywrap

```

## Input File Format

The input file by convention has a `.l` extension, and must have the following layout:

```
definitions
%%
rules
%%
user code
```

The `definitions`, `rules`, and `user code` section must be separated by a line that contains only 2 `%` characters.
The `user code` section is optional, and when it's omitted, the `%%` line above it may be omitted as well.

### `definitions` section

The `definitions` section contains 4 types of elements:
- *name definitions* are named regexp patterns for reuse.
- *start conditions* declare all possible states the scanner could be in, and their being inclusive or exclusive.
- scanner options are lines that start with `%option ...`.
- text surrounded by `%{ ... %}` where both `%{` and `%}` appear at the start of a line will be copied to the output with `%{` and `%}` removed.

Everything else in the `definitions` section is copied verbatim to the output without modification, including:
1. Indented text
2. C comments, i.e. text surrounded by `/* ... */` where `/*` appears at the start of a line.

#### name definitions

A name definition is a line of the following format:

```
name    definition
```
