---
title: "ArchLinux Pacman Cheatsheet"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## `-Q` mode: Query Local installed packages

`-s` is shorthand for `--search`.

### regex search for locally installed packages (over pkg name and description)

```sh
pacman -Q --search 'REGEX'
pacman -Qs 'REGEX'
```

### list all files from a locally installed package

```sh
pacman -Q --list 'PKG_NAME'
pacman -Ql 'PKG_NAME'
```

## `-S` mode: Operation on the sync index
