---
title: "GNU sed stream editor"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- linux
- GNU
- sed
---

The `sed` program is a line-based stream editor.
In the big picture, it reads a line from input, applies modification if requested by script, and print the modified line to the output,
and repeats until the whole input stream is consumed.

## What `sed` Cannot

`sed` doesn't support Perl regex. Only POSIX BRE and ERE are available when a pattern needs to be specified;
Among others, this means non-greedy matching is not possible with `sed`. Go to `perl` or `awk` for that.

{{<card "warn">}}

Sed is line-based (like `grep`), meaning that you're likely to get into trouble whenever you want to do something across the LF boundary.

There is the `-z` options, but it's not designed for such purpose of multiline processing, and is a hack after all.
Turn to awk or a real programming language for that.

Actually, I'm against the usage of `-z` in all cases. It has strange behavior:

{{<columns>}}

For input file:
