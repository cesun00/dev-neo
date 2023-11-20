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
- `Ctrl + k`	delete from cursor to the end of the command line
- `Ctrl + u`	delete from cursor to the start of the command line
- `Ctrl + w`	delete from cursor to start of word (i.e. delete backwards one word)
- `Ctrl + y`	paste word or text that was cut using one of the deletion shortcuts (such as the one above) after the cursor
- `Ctrl + xx`	move between start of command line and current cursor position (and back again)

- `Alt + b`		move backward one word (or go to start of word the cursor is currently on)
- `Alt + f`		move forward one word (or go to end of word the cursor is currently on)
- `Alt + d`		delete to end of word starting at cursor (whole word if cursor is at the beginning of word)
- `Alt + c`		capitalize to end of word starting at cursor (whole word if cursor is at the beginning of word)
- `Alt + u`		make uppercase from cursor to end of word
- `Alt + l`		make lowercase from cursor to end of word
- `Alt + t`		swap current word with previous

- `Ctrl + f`	move forward one character
- `Ctrl + b`	move backward one character
- `Ctrl + d`	delete character under the cursor
- `Ctrl + h`	delete character before the cursor
- `Ctrl + t`	swap character under cursor with the previous one

## Branching

POSIX shell and Bash are only capable of branching on the return value of a pipeline (i.e. the return value of the last process in the pipeline).
i.e. there is no native concept of boolean expression.

```bash
if <list>; then
    echo foo
elif <list>; then
    echo bar
else
    echo gg
fi
```

Return code 0 from `<list>` is considered true, and everything else is considered false.

Many built-ins have been introduced to mimic the return value of a process, saving a real fork-exec of child process.:
- `true` bash builtin: generate return code 0
- `false` bash builtin: generate return code 1
- `/usr/bin/[` executable and `[` bash builtin: POSIX compatible boolean expression evaluator
- `[[ ... ]]`: this double square bracket is a bash builtin

	```bash
	if [[! -d "$1"]];then
		>&2 echo "$1 is not an directory".
		exit 1
	fi
	```

### Logical Operators for Strings

Unary:

| syntax                         | semantics                                    |
|--------------------------------|----------------------------------------------|
| `-z string`                    | `true` if empty string (length zero)         |
| `-n string` or simply `string` | `true` if non-empty string (length non-zero) |

Binary:

| operator                                    | semantics                                                | sidenote                                                  |
|---------------------------------------------|----------------------------------------------------------|-----------------------------------------------------------|
| `string1 = string2` or `string1 == string2` | `true` if strings are literally identical                | For POSIX-correctness, use `=` version with `test` or `[` |
| `string1 != string2`                        | `true` if strings are not literally identical            |                                                           |
| `string1 < string2`                         | `true` if string1 sorts before string2 lexicographically |                                                           |
| `string1 > string2`                         | `true` if string1 sorts after string2 lexicographically  |                                                           |

### Logical Operators For Numbers

