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
