---
title: "Hexdump"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article is an overview of various hexdump utilities that print textual representation of arbitrary bytes to stdout.

1. hexdump from [util-linux](https://mirrors.edge.kernel.org/pub/linux/utils/util-linux/)

    hexdump can't perform bit-by-bit dump. Use `xxd` for that.

2. `xxd` (vim)

    Created by Juergen Weigert since 1990, this tools is now distributed with vim release.

    > The tool's weirdness matches its creator's brain.  Use entirely at your own risk. Copy files. Trace  it.  Become a wizard.

3. `od` (GNU coreutils)

3. `hexyl`



## `hexdump` (util-linux)

`hexdump` interprets arbitrary bytes from given file (or stdin if no file given) according to given format string.
The core usage of hexdump takes the form:

```
hexdump -e <format_string>
```

A `format_string` is a whitespace separated list of `format_unit`, defined as follows:

```conf
<format_string>:        # whitespace separated <format_unit>
    <format_unit> <WS> <format_unit> <WS> <format_unit>...

<format_unit>:  
    [<iter_count>/<byte_count>] <WS> "<format>"
    # if <iter_count> is omitted, defaults to 1 if omitted
    # if <byte_count> is omitted, use <format> specifier's default byte count
    # if either is present, slash must be spelled

<format>:
    <format> <format>           # a single <format> can have multiple specifier e.g. "%d %d", 
                                #       but is illegal if <byte_count> is given.
    %[width][.precision]d       # decimal integer
    %[width][.precision]x       # hex integer
```

