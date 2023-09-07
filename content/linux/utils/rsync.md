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
