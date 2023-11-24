---
title: "The clang-format Formatter"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

```bash
clang-format [options] <source files ...>
```

Supported coding style preset: `LLVM, GNU, Google, Chromium, Microsoft, Mozilla, WebKit`

ClangFormat respects a collection of format options, whose fallback values are specified by `--fallback-style=` options, which defaults to `LLVM`.

These format options are further overridden depending on the value of `--style=` CLI option, which defaults to `file` if omitted: 

- `file`: file `.clang-format` is searched in the containing directories of each given `<source files>`.
- One of the presets: use preset
- (since clang tools 14)`file:<path>`: explicit path to the configuration file
- `"{key: value, ...}"` specifies format options in JSON syntax on directly on CLI.

## languages

Target language is determined by inspecting file extension name:

- CSharp: .cs
- Java: .java
- JavaScript: .mjs .js .ts
- Json: .json
- Objective-C: .m .mm
- Proto: .proto .protodevel
- TableGen: .td
- TextProto: .textpb .pb.txt .textproto .asciipb
- Verilog: .sv .svh .v .vh

## config file

`.clang-format` or any alternative config file must be in YAML format.

Format options are designed to be flat: there is no hierarchy of options and sub-options. The nesting structure of YAML and json are only useful when a option has multiple customizable properties.

As for 2021.08, 141 format options are supported. For exhaustive list of supported format options: https://clang.llvm.org/docs/ClangFormatStyleOptions.html


## misc

It's a common need to create a `.clang-format` in the root directory when creating new project:

```bash
clang-format --style=llvm --dump-config > .clang-format
```
