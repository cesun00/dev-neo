---
title: "Bash Shell Tricks & Memos"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## CLI Invocation

```
-c		该选项后的第一个non-option argument将被视为在新bash进程里执行的命令。 执行完成后将退出bash。

-s		if bash is invoked without a script file (no more token remains after argument processing) or with -s, it take commands from STDIN.
		This allow positional parameter to be set when invoking an interactive shell.  // -si?
		
-i		start a **interactive** shell

-l		make the newly-invoked bash work as if it is a login shell

-r		invoke a **restricted** bash shell

-v		equivalent to --verbose
		show more infomation on each command / step that bash executes

if 
    1. arguments remains after option processing, and 
    2. neither `-c` nor `-s` option has been specified,
```
    
the remaining tokens will be treated as the name of a bash script, and will be executed.

## Default Shortcuts (w. `libreadline`)

- `Ctrl + a`	go to the start of the command line
- `Ctrl + e`	go to the end of the command line
