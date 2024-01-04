---
title: "GNU Bison (Yacc)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The original Yacc (Yet Another Compiler-Compiler) was written by Stephen Johnson.
It 


GNU Bison is a Yacc-compatible implementation.


## change symbol prefix

By default `yyparse`.

Use `%define api.prefix ...` or `-Dapi.prefix=...` or `-d` cli flag (deprecated) to chagne ...
This is implemented by 

```c
/* Substitute the variable and function names.  */
#define yyparse         fuckparse
#define yylex           fucklex
#define yyerror         fuckerror
#define yydebug         fuckdebug
#define yynerrs         fucknerrs
#define yylval          fucklval
#define yychar          fuckchar
```

Note that the actual function is still named `yyparse` etc in source level,
but will be replaced by macro processor. At the ELF symbols level you still get an `fuckparse` function.

```c
/*----------.
| yyparse.  |
`----------*/

int
yyparse (void)
{
    // impls...
```


This can cause huge confusion if you are first to yacc ecosystem and was searching for a `fuckparse` implementation
and can't find one FOR GODS SAKE.