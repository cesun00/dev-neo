---
title: "The Rsync Utility: An Introduction"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article is an introduction to the `rsync` utility for new users.
If you are a busy person, there is a cheat sheet for you [in the end](#cheatsheet).

`rsync` experienced multiple iterations. Historically it .
Modern usage of rsync recommends 

`rsync` talks to a remote host via either ... or TCP connection to a dedicated remote `rsync` daemon listening on port 873 by default.
We will be only discussing the daemon case since it's and everything else is legacy and more or less lack robustness.

Background
===========

*Berkeley r-commands* is a suite of program developed in 1983 by the Computer Systems Research Group at UCB that allows remote operation on another UNIX host through TCP/IP. It is developed for, and first appeared in the BSD UNIX v4.1.

These programs are:
- `rcp` (remote copy)
- `rexec` (remote execution)
- `rlogin` (remote login)
- `rsh` (remote shell)
- `rstat`
- `ruptime`
- `rwho` (remote who)

`rdist`

rsync
==========

```sh
rsync [options] <src_specification> <dest_specification>
```

The `rsync` program keeps the filesystem tree at `<dest_specification>` synchronized with that at `<src_specification>`
by transferring only the difference, known as the delta-transfer algorithm. It's similar to `git` but doesn't track the history, and
is capable of handling a tree with a much larger total file size - think about giga/tera -bytes.

`rsync` support both pull and push, but not copying between 2 remote hosts, meaning that either, but not both, of `<src_specification>` and `<dest_specification>` can nominate a remote host.

The default strategy to compute the difference between `<src_specification>` and `<dest_specification>` is the "quick check" algorithm which
compares only file size and EXT3/4 `mtime`. Use `-??` options to change this strategy.

## src/dest specification

The syntax of `src_specification` / `dest_specification` is only interesting when 

Whichever of `src_specification` and `dest_specification` specifies a remote host, 
the other must be a local filesystem path since copying between 2 remote hosts is not supported.
