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
BEGIN { RS="\0" }
```

- The number of records processed so far for all input files is stored in variable `NR`.
- The number of records processed so far in the current input file is stored in variable `FNR`. Reset to 0 whenever start processing a new file.

A record is break into fields by *field separator*.

## Split record into fields

Fields separator defaults to sequence of `BS`s, `TAB`s and `LF`s. To change, use either cli flag `-F` or set `FS` awk var:

```bash
awk -F ":" 'program' input  # or
awk "BEGIN { FS='/' }"
```

Fields are referred by `$<number>`. `$1` is the first field. `$0` is the whole record.

Variable `NF` is the number of fields in the current record.

## scripting

A gawk program looks like:

```awk
BEGIN       {RS='\t'}      # BEGIN is executed only once; Setup variables like `RS`, `FS` here.

# for each record; do:
pattern     {print $1}    # if current record matches <pattern>, perform action in parentheses
            {nlines++}    # patternless rules: run action unconditionally
            ...
# done

END         {print nlines;}          # END is executed only once; e.g. print final statistics here.
```

gawk program is executed as:

```
BEGIN();

for (record : records) {
    for (rule : rules) {
        if (record matches rule) {
            rule.action();
        }
    }
}

END()
```

### Actions

- `print` append a newline automatically. `printf` does not. Do it with `\n` in format string.


## Variable and data structures

```awk
{ x=$NF }   # x holds the text of the last field
```

## Patterns

The following type of patterns are supported: (see https://www.gnu.org/software/gawk/manual/html_node/Pattern-Overview.html)
- `/regex/`
- boolean expression
    - any expression: true = non-zero for number / non-null for string
    - comparison operator: https://www.gnu.org/software/gawk/manual/html_node/Typing-and-Comparison.html
- `BEGIN`/`END`:
- `BEGINFILE`/`ENDFILE`:
- empty: match all records


### regex

Regex patterns are specified between double slash: `/regex/ { action }`

### empty

Empty pattern matches every record.

E.g. The second action is executed for every record:

```awk
BEGIN { action } { action }
```

### boolean condition

TODO