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
