---
title: "Pluggable Authentication Modules (PAM)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

> Linux-PAM (Pluggable Authentication Modules for Linux) is a suite of shared libraries that enable the
> local system administrator to choose how applications authenticate users.

> In other words, without (rewriting and) recompiling a PAM-aware application, it is possible to switch
> between the authentication mechanism(s) it uses. Indeed, one may entirely upgrade the local authentication
> system without touching the applications themselves.

## Overview & Politics stuff

The Open Software Foundation (OSF) was a non-profit industry consortium for standardization of unix-like OS.
OSF was found in 1988 and later became *The Open Group*. TOG works with IEEE people and created POSIX.

"PAM" was meant to be a standard spec by OSF, but the reception of this standardization is frustrating.
The only active implementation now is the Linux-PAM project.

The essence of *authentication* is to trust a user's claim about who he is, among all accounts known by the system.

Historically, if an application wants to authenticate a linux user, it must:
1. ask the confronting human for a pair of login and password
2. hash the password as described in `man 3 crypt`
3. parse `/etc/shadow` to find a matching `(uid, hashed password)` pair; which means application code must have read permission on `/etc/shadow`.

The problems:
1. All applications wanting to authenticate someone repeat the hashing and text parsing code.
2. Granting access to the shadow file is dangerous.
3. Application code and *authentication mechanism* is tightly coupled: it requires re-compilation if one day the application wants to
    - switch to a totally different asymmetric crypto based auth method based on `${HOME}/.ssh/authorized_keys`; or
    - authenticate against some other `/etc/foo` registry with a different syntax, or against a SQL table / mongodb collection; i.e. we don't even authenticate *linux user* anymore, it could be user account of some online business system.

PAM is designed to provide such flexibility:
1. Admin can change the "authentication mechanism" of an PAM-used app on the fly by modifying PAM config files, without even restarting the app's process.

