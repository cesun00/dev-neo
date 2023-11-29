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
