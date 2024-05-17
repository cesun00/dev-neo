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
