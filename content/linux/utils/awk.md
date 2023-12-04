---
title: "GNU awk record TODO"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- linux
- GNU
- awk
---

`awk` is a record-based CLI text editor. It first splits a text file into delimiter-separated segments known as records,
then performs an action if a record matches a given pattern.
It is generally considered a superior replacement for `sed`, but with its own extra complexity.
`gawk` is GNU's implementation of awk. On most Linux distros is a symlink to `gawk`:

```ls
# $ ls -hl `which awk`
lrwxrwxrwx 1 root root 4 Nov  4  2023 /usr/bin/awk -> gawk
```

## CLI invocation

TODO

## Split input files into records

*Record separator* is defined in variable `RS`. 

`RS` defaults to `\n`, thus gawk cuts input file into lines by default. `RS` must be a single character in standard `awk`, otherwise it's treated as a regex and is only valid in `gawk`.

Usually `RS` is changed in the `BEGIN` section. E.g. to use the `'\000'` null char as RS:

```awk
# useful when reading pipelined output from `find -print0`
