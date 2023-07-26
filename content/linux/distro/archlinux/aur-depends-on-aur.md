---
title: "Install an AUR package that depends on another AUR package"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Most AUR packages depend only on packages in the official repository.
Installing such AUR packages requires only cloning its repository followed by invoking `makepkg -si` there.

It's thus often ignored that `makepkg` in its essence is simply a packaging program that generates archives understood by `pacman`, 
where the actual installation is performed. The `PKGBUILD` file of an AUR package documents its required dependencies, and
`makepkg`, when producing the archive, balks if any of them is not already installed on the system via `pacman`.

It is the `-s` option that additionally attempts to install missing dependencies, but only from the official repository:

> -s/--syncdeps
> automatically resolves and installs any dependencies with pacman before building. If the package depends on other AUR packages, you will need to manually install them first.
>
> https://wiki.archlinux.org/title/Arch_User_Repository#Build_the_package

A good example is the [mycli](https://aur.archlinux.org/packages/mycli) command line SQL client.
Classic `makepkg -si` for this package will complain:

```
error: target not found: python-sqlglot
==> ERROR: 'pacman' failed to install missing dependencies.
```

since `python-sqlglot`, as of this writing, is also an AUR package. This can be solved by simply install `python-sqlglot` from AUR first:

```sh
git clone https://aur.archlinux.org/python-sqlglot.git && cd python-sqlglot && makepkg -si
```

(`python-sqlglot` has its own problem of not mentioning `pip` as its dependency, but this is another story. Have `pip` installed by `pacman -S python-pip` and the above build will work fine.)

Now re-run `makepkg -si` for `mycli`, and everything rolls out!