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

TODO

### Branch if Pattern Matches

The `[[]]` syntax is assumed in this section.
All operators respect the `nocasematch` shopt option for case-sensitivity.

#### Wildcard Pattern

Operator `==` and `!=` can test whether a string matches a *glob* pattern.

```bash
if [[$MYVAR == pattern]];then
    echo "asdasd"
fi

if [[""!=""]];then
    echo "asdasd"
fi
```

#### POSIX Extended Regex and Capturing Group Support (man 3 regex)

Operator `=~` can perform POSIX extended regex, return 0 when match, 1 when mismatch, and 2 when RHS pattern has bad syntax.

`shopt -s/-u nocasematch` for case-insensitive/sensitive matching.

The scanning stops when the first match is found, i.e. `regexec` is called only once.

After a successful match, the `BASH_REMATCH` array variable
- stores the whole matched text at index 0
- stores each capturing group since index 1

```bash
i='[Comic][JOJO 的奇妙冒險 Part7.STEEL.BALL.RUN][荒木飛呂彥][天下][小成]Vol_22.zip'
if [["$i" =~ .*(Vol_..)\.zip ]]; then
    declare -p BASH_REMATCH
fi
# prints: declare -a BASH_REMATCH=([0]="[Comic][JOJO 的奇妙冒險 Part7.STEEL.BALL.RUN][荒木飛呂彥][天下][小成]Vol_22.zip" [1]="Vol_22")
```

[**It's recommended to put the pattern in an variable**](https://stackoverflow.com/a/1892107).

Quoting the pattern has special semantics:

> Any part of the pattern may be quoted to force the quoted portion to be matched as a string. (man bash)


POSIX reg doesn't support non-greedy asterisk : https://stackoverflow.com/questions/20239817/posix-regular-expression-non-greedy

### `switch`

`;;` is equivalent to a `break` in common programming langauges.

```bash
case test-string in
	pattern-1)
		commands-1
		;;
	pattern-2)
		commands-2
		;;
	...
esac
```

`pattern` can contain:
- `*`	matches any sequence of character
- `?`	match a single character
- `[...]`
- `|`	list alternatives

### `select`: interactive prompt

The `select` keyword prompts an interactive menu for user to pick an option:

```bash
select var in <tokens>; do
	commands
done
```

where `<tokens>` is a sequence of whitespace-separated tokens.
The `in <tokens>` part can be omitted, which is equivalent to `select var in $@; do ...`.
`$@` is ws-separated tokens of bash invocation args outside functions, and function invocation args inside functions.

e.g. 

```sh
select var in foo bar zoo; do
	echo "you've chosen $var"
	# do something else based on choice of $var
done
```

The above structure is equivalnet to the following loop:

```c
while (true) {
	prompt a choice menu
	wait for stdin and set $var value

	execute whatever pipeline in the block		// you must explicitly use `break` or will loop forever
}
```

## Loop

### for each token

```bash
# 用`$(seq first last)`或`{first..last}`来生成 tokens
for value in whitespace separated tokens; do
	echo $value
done
```

Omitted `in whitespace separated tokens` defaults to `$@`. `$@` is ws-separated tokens of bash invocation args outside functions, and function invocation args inside functions.

```bash
# ./print-fruits.sh apple watermelon citrus
for fruit; do
	echo $fruit # apple watermelon citrus
done
```

### C-like triplet `for` loop

```bash
for (( i=0 ; i < 10 ; i++ )); do
    echo $i
done
```

`(( ... ))`	is one of arithmetic evaluation environment, thus `=` and `+` does proper math instead of comparing strings.

Search for `ARITHMETIC EVALUATION` in `man 1 bash` for other arithmetic evaluation environments.

### while / until

```bash
while <list>; do
    commands
done

# negated while
until <list>; do
	commands
done
```

## Expansion

*Expansion* is whatever bash does to convert raw text input from stdin (supplied by `libreadline`) to arguments of `execve(2)` syscall.

Expansions are done in the following order:

1. Brace expansion: 2 type of `{}` enclosed sytnax are first expanded, e.g. `{0...9}` and `{a,b,c}.txt`
2. Tilde expansion: then, `~` are replaced with user's home directory
3. Parameter (a.k.a Variable) expansion 
4. Arithmetic expansion
5. Command Substitution expansion

### Parameter Expansion

#### prefix/suffix removal

See `man bash` section "Parameter Expansion" 

Syntax:

```bash
${var#pattern}      # prefix non-greedy removal
${var##pattern}     # prefix greedy removal
${var%pattern}      # suffix non-greedy removal
${var%%pattern}     # suffix greedy removal
```

```bash
filename=foobarfoo.bar.mp3
echo ${filename#f*o}    # obarfoo.bar.mp3
echo ${filename##f*o}   # .bar.mp3
echo ${filename%bar*}   # foobarfoo.
echo ${filename%%bar*}  # foo

# works element-wise if var is an array indexed by `@` or `*`
# TODO
```

Useful snippet for splitting filename and extension. [(credit)](https://stackoverflow.com/questions/965053/extract-filename-and-extension-in-bash):

```bash
filename=$(basename -- "$fullfile")
extension="${filename##*.}"
filename="${filename%.*}"
```

#### Pattern Substitution

Syntax: `${var/glob/string}`

```bash
# `#` and `%` matches the beginning and the end of the value
# of `var`, respectively.
x=42
echo "${x/#/str}" # str42
echo "${x/%/str}" # 42str

# works element-wise if var is an array indexed by `@` or `*`;
words=(foo zoo oop)
echo "${words[@]/oo/xx}" # fxx zxx xxp
```

#### To Uppercase/Lowercase

The following is bash-specific. For posix see [this](https://stackoverflow.com/questions/2264428/how-to-convert-a-string-to-lower-case-in-bash).

```bash
hw="HeLlO WoRlD"
echo "${hw,,}" # all to lowercase
echo "${hw^^}" # all to uppercase
```

#### Fallbacks

```bash
# expand $HOME if $XDG_DATA_HOME is unset or null. (TODO: null?)
echo "${XDG_DATA_HOME:-$HOME/.local/share}"
```

## Variables

A new variable is introduced by its first assignment:

```sh
x=42
readonly x
x=52    # bash: x: readonly variable
```

### Array

In Bash's speech, there are 2 types of arrays:
1. associative array (hashmap), and
2. Indexed Array (list).

    Is an associative array with the restriction that `key` (still a string) must resolves to a non-negative integer.
    Normally should be 0-based.

```bash
# associative array
declare -A map_a

# Indexed Array
declare -a arr_a
# or
arr_b[0]=42
```


#### Compound Assignment

```bash
# if `xxx` is not declared, this creates an indexed array of size 6;
# or if `xxx` was declared as an indexed array, this overwrites it.
xxx=(1 2 3 x y z)

# if `yyy` was declared as an associative array, the same syntax
# overwrites it as `([3]="x" [1]="2" [y]="z" )`.
yyy=(1 2 3 x y z)
# and is equivalent to `yyy=([1]=2 [3]=x [y]=z)`

# if `zzz` is not declared, or was declared as an index array,
# this produce undefined behavior:
zzz=([a]=42 [b]=11)

# if `uuu` was declared as an associative array,
# this works as expected:
uuu=([a]=42 [b]=11)
```

#### Push Back

```bash
arr_a=()
arr_a+=('foo')  # the surrounding () is required
arr_a+=('bar')
# $ declare -p arr_a
# declare -a arr_a=([0]="foo" [1]="bar")

# wrong example
arr_b=()
arr_b+='foo'
arr_b+='bar'
# $ declare -p arr_b
# declare -a arr_b=([0]="foobar") # become concatenation
```

https://stackoverflow.com/questions/1951506/add-a-new-element-to-an-array-without-specifying-the-index-in-bash

#### Element Accessing & Assignment

```bash
arr_a=(1 2 3 x y z)
declare -A map_a
map_a=(usa washington china beijing france paris)

# read
echo ${arr_a[3]} # x
echo ${map_a[france]} #paris

# assign
arr_a[3]='foo'
echo ${arr_a[3]} # foo
map_a[france]='foo'
echo ${map_a[france]} # foo

# expanding the whole array
arr_b=('a    b' 'c   d   e')
echo ${arr_a[@]} # echo receives 5 words: `a`,`b`,`c`,`d`,`e`
echo ${arr_a[*]} # always equivalent to above
echo "${arr_a[@]}" # echo receives 2 words: `a    b` and `c   d   e`
echo "${arr_a[*]}" # echo receives 1 words: `a    b<FC_IFS>c   d   e`,
# where <FC_IFS> is the first character of the special variable `IFS`
```

#### Iteration

```bash
a=(1 2 3 a b c)
# get length
echo "${#a[@]}" # 6
# by value
for v in "${a[@]}"; do echo "$v"; done
# by index
for i in "${!a[@]}"; do echo "cur: $i - ${a[$i]}"; done
```

#### Delete Element

```bash
a=(1 2 3)
declare -p a # declare -a a=([0]="1" [1]="2" [2]="3")
unset a[1]
declare -p a # declare -a a=([0]="1" [2]="3")
```

#### Element-wise Mapping

**Simple scenario**: prepend or append some characters to each element:

https://stackoverflow.com/questions/27346410/expand-bash-array-into-curly-braces-syntax

```bash
oj=(uva poj hdu leetcode)

for d in "${oj[@]/#/src/}"; do echo "$d"; done

# combine with compound assignment,
# we can make the result in a new array
srcoj=("${oj[@]/#/src/}")
```

**More general solution**: set `IFS=,` so that `eval` text becomes valid `{,,,}` syntax

https://unix.stackexchange.com/questions/90938/possible-to-use-brace-permutation-and-array-expansion-simultaneously

Demo: surroundings (i.e. prepend and append at the same time), plus special character (semicolon) handling:

```bash
oj=('u;v;a' 'p;o;j' hdu leetcode)

OLDIFS=$IFS
IFS=,
# Pattern substitution by default only replace the longest match
# If pattern begins with a '/', all occurrence of pattern are replaced. i.e. the reason for '/;'
eval echo "foo{${oj[*]//;/\\;}}bar"    # foou;v;abar foop;o;jbar foohdubar fooleetcodebar
IFS=$OLDIFS
```

Eval always makes shell code harder to read and maintain. In doubt, use ordinary for loop.

## Function

```sh
valid() {
    echo 42
}

alsoValid() { echo 42; }

invalid() { echo 42 }
```

The closing curly brace must either
- be in a separate line; or
- preceded by a `;` token 

Function name is simply a variable storing the literal source code of the function body.

Nothing is done at parse time. Not even syntax check, set aside vairable expansion.

Export a function (bash specific):

```sh
foo() {
    echo 'foo'
}

export -f foo # done by creating a env var `BASH_FUNC_foo%%`
```

### Arguments

```bash
funcName() {
    # $0 is always the invoked name of the shell
    echo "${0}"

    # access individual argument
    echo "${1}" "${2}" "${15}"

    # access all arguments as a sequence of bash token
    echo "$@"
}
```

Given `print-args`, a simple C-program that dumps its `argv[]` array:

```bash
#!/bin/bash

foo() {
    ./print-args $@
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args $*
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args "$@"
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args "$*"
# argc=2
# argv[0]=>./print-args<
# argv[1]=>a b c<
    OLDIFS="$IFS"
    IFS="S"
    ./print-args $@
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args $*
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args "$@"
# argc=4
# argv[0]=>./print-args<
# argv[1]=>a<
# argv[2]=>b<
# argv[3]=>c<
    ./print-args "$*"
# argc=2
# argv[0]=>./print-args<
# argv[1]=>aSbSc<
    IFS="$OLDIFS"
}

foo a b c
```

## Pipelining & Redirection

Pipeline establishes before any redirection. This means the second line pipes foo's stderr as well:

```bash
foo | bar		    # foo's stdout to bar's stdin
foo 2>&1 | bar		# foo's stdout to bar's stdin, then foo's stderr to foo's stdout = foo's stderr to bar's stdin
```

Bash support a dangerous syntactic sugar for this:

```bash
foo |& bar		    # equivalent to `foo 2>&1 | bar`
```

### FD duplication

`n>&m` clones the file descriptor `fd[n] = fd[m]` so that `fd[n]` and `fd[m]` refer to the same file description.\

If `n` is 1 (stdout), it could be omitted. When more than 1 redirection/duplication are put on the cli, they happen in textual order.

Under the hood bash use `man 2 dup` syscalls. See [](./linux-pipe.md) for a kernel perspective of such duplication.

```bash
>&2 echo "echo to stderr" # equivalent to: 1>&2 echo "echo to stderr"
```

FD duplication is just one type of redirection, so it happens after pipeline establishment. For instance, neither of the following will pipe stuff to `hexdump`:

```bash
>&2 echo "echo to stderr" | hexdump -C      # hexdump receives nothing
```

1. echo's stdout to hexdump's stdin (pipe)
2. echo's stdout to echo's stderr (dup) ; Thus hexdump receives nothing.

Mixing `|&` syntax and fd duplication is dangerous:

```bash
>&2 echo "echo to stderr" |& hexdump -C     # again, hexdump receives nothing
```

The above may feels like we are sending stdout to stderr's device, and pipe everything via stderr to `hexdump`.
But remember after desugaring the line is really:

```bash
1>&2 echo "echo to stderr" 2>&1 | hexdump -C     # again, hexdump receives nothing
```

Don't forget that pipeline happens first, and then redirection/duplication happens in textual order. So

1. echo's stdout are connected to hexdump's stdin (pipeline)
2. echo's stdout dup stderr (the tty)
3. echo's stderr dup stdout (the tty)

Thus everything is still sent to the terminal.

### heredoc
Heredoc is still affected by all the bash expansion rules:

```bash
cat <<EOF
${BASHPID}
EOF
# prints: 11216
```

### here string

### function / block construct can be redirected

```bash
fooo() {
	head -c3 -
	echo
	head -c3 -
	echo
	head -c3 -
	echo
}

echo '123abc999ggg' | fooo
# 123
# abc
# 999
```


```sh
echo -e '123abcxxx\n000\n' | while read data; do   echo $data;   head -c1;   echo; done
# 123abcxxx
# 0
# 00
```

## Input / Output

### `read`

Read 1 line from stdin, or from a file descriptor if `-u <fd>` is given, into an variable, *with LF removed*.

If no variable name is given, defaults to `$REPLY`.

```bash
# loop over each line of file
while read line; do
    echo $line
done </etc/passwd
```

### mapfile / readarray

```bash
</etc/passwd mapfile -n 42 my_array

# $ declare -p my_array 
declare -a my_array=(
    [0]=$'root:x:0:0::/root:/bin/bash\n' 
