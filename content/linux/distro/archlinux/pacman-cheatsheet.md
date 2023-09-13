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

`-s` is shorthand for `--search`.

### regex search for remote packages

```sh
pacman -S --search 'REGEX'
pacman -Ss 'REGEX'
```

### Install

## `-R` mode: removal

`-s` is shorthand for `--recursive`.

```sh
# remove only the specified package
pacman -R PKG_NAME

# Remove dangling dependencies as well
pacman -Rs PKG_NAME

# TODO
pacman -Rsu PKG_NAME
```
