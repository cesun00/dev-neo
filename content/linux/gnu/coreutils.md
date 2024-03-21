---
title: "GNU Coreutils: Shell Tools"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## Path Handling

- `dirname`
- `basename`
- `realpath`
- `readlink`: 

## scripting

conditions
- `[`
- `test`

math
- `expr`
- `factor`


- `yes`
- `true`
- `false`

## users / permission / security

- `id`
- `who`
- `whoami`
- `users`: print currently loggged-in users

- `stty`
- `tty`

- `chgrp`
- `chmod`
- `chown`
- `chcon`
- `chroot`

## device

- `du`
- `dd`
- `df`

## filesystem tree structure / metadata

- `unlink`
- `touch`
- `stat`
- `ls`
- `dir`: equivalent to ‘ls -C -b’
- `vdir`: equivalent to `ls -l -b`
- `rm`
- `rmdir`
- `mv`
- `mkdir`

- `mkfifo`
- `mknod`
- `mktemp`

## file content transform

- `cat`
- `tac`
- `cut`
- `split`
- `sort`
- `uniq`
- `comm`: compare sorted files
- `expand`: convert TAB to spaces
- `unexpand`
- `head`
- `tail`
- `tr`: TRanslate or delete characters
- `truncate`: truncate or extend file content to a given size
- `shred`: 
- `wc`
- `fmt`: reformat each line in a text file to a certain max width without breaking English words.
- `fold`: like fmt
- `tsort`: interpret input as dependency description and perform a topological sort
- `shuf`: shuffle the lines from stdin
- `od`: octal and hex dump

## env

- `printenv`
- `env`

## misc

- `date`
- `dircolors`
- `echo`
- `seq`
- `timeout`
- `sleep`
- `tee`: copy stdin to stdout and to a file
- `pwd`
- `printf`

checksum
- `sum`: BSD (16-bit) checksums.
- `b2sum`: BLAKE2b digest
- `cksum`: facade to various checksum algorithm
- `md5sum`
- `sha1sum`
- `sha224sum`
- `sha256sum`
- `sha384sum`
- `sha512sum`

encode/decode
- `base32`
- `base64`
- `basenc`



- `cp`
- `csplit`


- `hostid`
- `install`
- `join`
- `link`
- `ln`
- `logname`


- `nl`
- `nohup`

- `numfmt`: convert a number between different units, e.g. `10Mi -> 10485760`
- `paste`
- `pathchk`
- `pinky`
- `pr`
- `ptx`


- `runcon`
- `stdbuf`







## OS / Kernel / SysOps

- `uname`
- `nice`
- `sync`
- `nproc`: print number of CPU