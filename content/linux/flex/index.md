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

There must be no indentation before `name`.
`name` conforms to the same rules of a C variable name, except that `-` (dash) is allowed in the middle.

```
DIGIT   [0-9]
ID      [a-z][a-z0-9]*
```

Name definitions can be referred to later in the rules section by `{name}` (i.e. surrounded by a pair of curly brace),
which will expand to `(definition)` (i.e. surrounded by a pair of parentheses). e.g. `{DIGIT}+"."{DIGIT}*`  is identical to `([0-9])+"."([0-9])*`.

#### start conditions

If you have experience with a manually written lexer, start conditions are equivalent to (actually, implemented as) the `enum State` whose instance will be switched on in the while-switch idiom.

A scanner is essentially a state machine, where the same character sequence can have different interpretations depending on the current state
of the scanner. Some character sequences aren't even allowed in some states. For example, a `*/` marks the end of a comment when a previous `/*` has put the scanner into the `COMMENT` state, but means a multiplication operator and a division operator in an arithmetic expression
(of course, such an operator sequence is a syntax error in most programming languages, but judging that is the job of the parser).

Each start condition is defined on un-indented lines beginning with either `%s` or `%x` followed by a list of names.
- `%s` introduces an inclusive start condition
- `%x` introduces an exclusive start condition

To write a rule that is active only when the scanner is in a given state `sc`, prefix that rule with `<sc>`.
Use a comma-separated list for a rule that is active for more than 1 state, e.g. `<sc1, sc2, sc3>`.

An example of start conditions would be like this:

```lex
%{
#include <stdio.h>
%}


%s EXAMPLE

%%

bar {
    /* when word `bar` is encountered, enter EXAMPLE state */
    BEGIN(EXAMPLE);
    puts("Entered EXAMPLE state.");
}

<EXAMPLE>foo {
    /* this rule is only activated in EXAMPLE state */
    puts("see foo in the EXAMPLE state");
}

foo {
    puts("nah nah nah");
}
```

```sh
# echo 'foo bar foo' | ./main
nah nah nah
 Entered EXAMPLE state.
 see foo in the EXAMPLE state
```

The scanner starts working in a special state called `INITIAL`.
Any rules without a start condition prefix are implicitly prefixed by `<INITIAL>`.
To transfer to a different state, use the `BEGIN(sc)` special directive in the action code.

- `BEGIN` an inclusive start condition `foo` activates all rules prefixed with `<foo>` and `<INITIAL>`, and deactivates every rule else.
- `BEGIN` an exclusive start condition `bar` activates all rules prefixed with `<bar>` and deactivates every rule else.

#### Scanner options

Comments may not appear on an ‘%option’ line.

### `rules` section

This section contains lines of the following format, each known as a *rule*:

```
pattern     action
```

`pattern` is a POSIX extended regular expression (see `regex(7)`).
See [Flex's manual](https://westes.github.io/flex/manual/Patterns.html#Patterns) for precise supported syntax.
There must be no indentation before `pattern`.
`pattern` ends at the first non-escaped whitespace character.

`action` describes some action to carry out if the `pattern` matches a prefix starting at the head of the input stream.
If there is more than 1 rule whose `pattern` matches, the one that matches the longest text is selected.
`action` is either a single `|` (bar) character that repeats the action of the next rule,
or a sequence of one of
1. a C statement
3. an `ECHO;` directive, which prints the content of `yytext` to the `yyout` file
4. a `BEGIN sc;` or `BEGIN(sc);` directive, which transfers the state of the scanner to `sc` start condition.

    The parenthesized syntax is recommended.

5. a `REJECT;` directive, which ends the execution of the current action, and in case more than 1 rule matches a current prefix,
executes the action of the next best matches.
6. a `yymore();` function call, which does nothing immediately, but tells the scanner to, in the next call to `yylex()`, append the next token to the current `yytext`, instead of overwriting it.
7. a `yyless(n);` macro, which puts back to the input stream all but the first `n` character of the current `yytext`.
8. a `unput(c);` function call, which puts back to the input stream an arbitrary character `c`.
9. a `input();` function call, which consumes and returns the next character from the input stream.
10. a `YY_FLUSH_BUFFER;` directive, which clears the internal buffer of the scanner, such that the next call to `yylex()` must fill the buffer first (with `YY_INPUT` macro).
11. a `yyterminate();` macro, which cause the `yylex()` to return 0 to its caller, indicating "all done". This is equivalent of an `return 0`.

All statements in `action` must be on the same line of `pattern`, unless surrounded by a pair of `{}`,
in which case all texts within are considered `action`.

Special caution must be taken when one wants to have comments about a rule in the rules section.
Comments may not appear in the `rules` section wherever flex is expecting a regular expression.
A `/*` appears at the beginning of a line is considered a regexp instead of marking the start of comments.

### `user code` section

All text in the `user code` section is copied to the output file verbatim.

<!-- ## Generated Parser Internals

Unless changed by the 

The generated parser calls a macro `YY_INPUT(buf,result,max_size)` to ...
The default implementation of `YY_INPUT` is to 


```c
extern FILE *yyin, *yyout;
```

```
