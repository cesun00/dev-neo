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
