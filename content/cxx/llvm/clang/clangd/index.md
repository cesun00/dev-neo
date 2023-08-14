---
title: "The `clangd` Language Server"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

### Introspect Context 

A `compile_flags.txt` at the source root contains build flags that applies to all files in the project, one per line.
It is equivalent to `clang $FLAGS some_file.cc` where `$FLAGS` are read from this file.
This file will be ignored if compile_commands.json is present.
 

A `compile_commands.json` file, if present, contains commands to compile each file in the project.
See https://clang.llvm.org/docs/JSONCompilationDatabase.html for a specification of this file.

Ideally, build systems should be able to export such information.

### The Language Server Protocol (LSP)

Clangd uses the Language Server Protocol for communication with a client.

> LSP was originally developed for Microsoft Visual Studio Code and is now an open standard. On June 27, 2016, Microsoft announced a collaboration with Red Hat and Codenvy to standardize the protocol's specification.

