---
title: "A history of login password management: the shadow suite, glibc, and libxcrypt"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Linux was born in 1991. By the year of 1996, most Linux distros (including Slackware 2.3, Slackware 3.0, and other popular distributions) 
stored user information including passwords in the `/etc/passwd` file.
This is a line-oriented text file where each line consists of colon-separated columns. The second column stores
a crypto hash of the user password obtained from a `char *crypt(const char *key, const char *salt);` call.

This function dates back to the ages of Research UNIX.
[A rotor-based `crypt()` function first appeared in Version 3 AT&T UNIX (Feb 1973). A DES-based `crypt()` first appeared in Version 7 AT&T UNIX.](https://man.openbsd.org/crypt). On the GNU/Linux side, the DES version is implemented in the first place of glibc 1.00.
`UFC-crypt` is created by Michael Glad. GNU claims that their implementation is 30-60 times faster than the unix one.

Linux libc4/5, forked from glibc 1.09, adding MD5 support triggered by a `$1$` prefix in `salt`.

This function originated in `libc4` and `libc5`.

glibc later ..
For a very long time, this function was provided by `libcrypt` which is a part of glibc,
usually in the form of a shared object named `libcrypt.so.1`.

To add a new user with password, `crypt` is invoked with `key = password plaintext` and `salt = `.
`crypt` returns an static allocated buffer which is guaranteed to be prefixed by `salt`.
This allows
For the `lib5`, `salt` must be at least 2 character string consist of `a-zA-Z0-9./`.
For any given `key`, this allows its output to be perturb...
The glibc implementation of this function adds addition .

`libcrypt` sources resided in the `crypt/` directory in the glibc source tree.
The shared object was built by default with a normal glibc build.
- Since glibc 2.38 (2023-07-31), explicit `--enable-crypt` and `--enable-nss-crypt` are required to build the original `libcrypt`
- Since glibc 2.39 (2024-01-31), `crypt/` has been removed from the source tree. The aforementioned `configure` options are no longer available. The section about `libcrypt` functions was removed from `manual/crypt.texi`.

glibc maintainers recommend `libxcrypt` as the drop-in replacement for `libcrypt`:

> The replacement for libcrypt is libxcrypt, maintained separately from
> GNU libc, but available under compatible licensing terms, and providing
> binary backward compatibility with the former libcrypt.  It is currently
> distributed from <https://github.com/besser82/libxcrypt/>.

Be careful about the `crypt(3)` man page on your system.
- The man pages written for the legacy `libcrypt` are part of the `man-pages` project.
[They still exist in the latest `man-pages` release](https://github.com/mkerrisk/man-pages/blob/ae6b221882ce71ba82fcdbe02419a225111502f0/man3/crypt.3).
See [here](https://man7.org/linux/man-pages/man3/crypt.3.html) for an online version.
- `libxcrypt` provides man pages titled also `crypt(3)`. See [here](https://man7.org/linux/man-pages/man3/crypt.3.html) for an online version.

Some distributions, including ArchLinux, have been disabling the build of `libcrypt` with glibc and have turned to `libxcrypt` for a long time.
[Such distributions may have removed the `man3/crypt.3` and related entries](https://gitlab.archlinux.org/archlinux/packaging/packages/man-pages/-/blob/07d42a77073e5b2363e0acbd00dcc11760eda2bf/PKGBUILD#L49) from the upstream before building the `man-pages` package, such that only
the manuals provided by openwall `libxcrypt` are available.

Also, don't get confused with the `xcrypt(3)` pages.
They are documents for legacy functions in `rpc` module of glibc.

## `libxcrypt`

[libxcrypt](https://github.com/besser82/libxcrypt) from the openwall project.
Huge efforts were made to ensure that `libcrypt.so.2` can be a drop-in replacement for `libcrypt.so.1` from glibc.
Any program link against the glibc's `libcrypt` should run normally with `libxcrypt`.

## TODO: more symbols from libcrypt and libxcrypt


`encrypt(3)`, etc.

## How does `shadow` get into the game

The apparent problem with `/etc/passwd` is that it must be readable by anyone.
If you were to change the `/etc/passwd` file so that nobody can read it, the first thing that
you would notice is that the ls -l command now displays user ID's instead of names.

Given the fact it stores password hashes

[The shadow package](https://github.com/shadow-maint/shadow)
is related to glibc in an interesting way.







```
grpconv   The `pwconv` command creates `shadow` from `passwd` and an optionally existing shadow.
grpunconv   The `pwunconv` command creates `passwd` from `passwd` and `shadow` and then removes shadow.
pwconv        The `grpconv` command creates `gshadow` from `group` and an optionally existing gshadow.
pwunconv    The `grpunconv` command creates `group` from `group` and `gshadow` and then removes gshadow.

chage
chgpasswd
chpasswd
expiry
faillog
getsubids
gpasswd
groupadd
groupdel
groupmems
groupmod
groups
grpck
lastlog
newgidmap
