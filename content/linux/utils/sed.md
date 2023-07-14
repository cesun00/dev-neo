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

```sh
# $ cat in.txt 
foo
bar
bar
```

<--->

and pattern 'foo<LF>bar', `grep` considers the second `bar` to be part of a match:

```sh
# $ grep -z $'foo\nbar' in.txt
foo
bar
bar
```

{{</columns>}}

{{</card>}}




{{<card "warn">}}

`sed` does not support Perl RE, thus there is no non-greedy qualifier like `*?` or `+?` etc.

However, there is a wonderful technique that allows you to be non-greedy matching a region of text if that region has an explicit
end mark, e.g. a `/* */` comment:

```sh
sed -z -E 's:/\*([^*]|\*[^/])*\*/::g'
```

{{</card>}}



## CLI invocation

Not surprisingly, `sed` without any command prints the file intact. Keep in mind that `sed` is line-based, meaning that if you want to do anything that cross the boundary of lines, expect difficulties to be encountered.

- reads from stdin, unless files are given as positional arguments

    multiple input files are concatenated to form a single stream, unless `-s` is used.

- write to stdout, unless
    - `-i` is requested to overwrite the given input file
    - `-n` is used for quiet mode

```sh
# read from stdin, print to stdout
sed <pattern>

# read from file, print to stdout
sed <pattern> <files...>
sed <files...> -e <pattern>
```

The `W` and `w` command, and the `s` command with the `/w` flag, allow writing the current [pattern space](#execution-flow) to an extra file.

{{<card "info">}}

#### Note for beginner shell user

the following attempt to edit a file in-place won't work and will erase your input file:

```sh
sed 'pattern' <input >input
```

This phenomenon is not specific to `sed`, and holds for all Unix pipeline-oriented programs.

See [pipeline redirection](#TODO) for an explanation

{{</card>}}

<!-- `sed` is not aware of the concept of line. -->

## Commands

Sed commands are given by one or more `-e <expression>` and / or `-f <script file>` options.
Within the same expression or script file, multiple command can be given by separating them with a semicolon (`;`):

```sh
sed -n '16224,16482p;16483q' filename
```

A sed command conforms to the 

```
[addr]X[options]
```

- `[addr]` selects the lines only on which `X` commands are executed
- `[options]` are only required by some `X` that need additional
- `X` can be a `{...}` group 

### `[addr]` specification

1. specify a unique line by its line number
2. specify a range of lines by `start,end`, both inclusive.
3. specify lines that contains a specific pattern by `/pattern/`

The last one needs to be distinguished from commands that itself can have `pattern` as options, e.g. `s`:

```sh
# replace all `hello` with `world` across the whole file
sed 's/hello/world/' input.txt > output.txt

# replace all `hello` with `world` only on line 144
sed '144s/hello/world/' input.txt > output.txt

# replace all `hello` with `world` only on line 4 to 17
sed '4,17s/hello/world/' input.txt > output.txt

# replace all `hello` with `world` only on line that contains `apple`
sed '/apple/s/hello/world/' input.txt > output.txt
```


### common `[options]`

## Scripting

Sed exhibits a certain level of programmability, specifically, it supports loop and branching.

```sh
# Read from stdin and process the input to remove Java comments
sed -E '
  # Remove multi-line comments (handling nested properly)
  :a

  s:/\*([^*]|\*[^/])*\*/::g;
  t b

  # If there are still multi-line comments, restart from label a
  /\/\*/ { N; ba }
  :b
'
```

### Branching

A label is introduced by `:label` syntax

- `t label`: jump to `label` if a previous `s` command successfully match and replace something
- `T label`: jump to `label` if a previous `s` command matches nothing

## Execution Flow

`sed` maintains 2 buffers: the pattern space and the hold space.

```js
while (input EOF not reached) {
    line number, pattern space = consume next line from input

    for each command with (addr, X) {
        if (line number in addr) {
            execute(pattern space, X);   // different `X` command can have different logics of execute()
        }
    }

    if (`-n` option) {
        print(pattern space)
    }
}
```

## MISC

### the -z option

-z is a very special option that triggers sed to consider `/0` as line separator when reading from input streams.
Normal text file doesn't usually contains `\0` so this will cause `sed` to read all file content into memory.
So basically you are handling a single long long line.

If the file is too large to fit in your memory, think twice.

`LF` is no longer a special character with `-z`, and can thus be used in various pattern matching,
-z also makes the `[addr]` selection meaning less. 

The usefulness of -z is that `s` (and other pattern matching commands) now can pattern matching the whole file, without limited by the LF boundary that introduced by pattern space reading. However this doesn't solves all problem with multiline processing.

note: GNU `grep` has `-z` flag for the same functionality.


## Usage Cheatsheet

### extract line range

```bash
sed -n '16224,16482p;16483q' filename > newfile
```

https://stackoverflow.com/questions/83329/how-can-i-extract-a-predetermined-range-of-lines-from-a-text-file-on-unix