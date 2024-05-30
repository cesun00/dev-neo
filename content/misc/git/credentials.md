---
title: "Git Remote Credentials"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Certain operations on a git remote require authentication, e.g. cloning a private repository, pushing to a new empty repository or a protected `master` branch, etc. On the contrary, cloning a public repository never requires authentication.

Authentication is transparent when talking to a git remote via SSH, signaled by a, for example, `git@github.com:...` remote URL.
When using an `http(s)` remote URL, there must be a mechanism for a user to prove his identity for such auth-required operations.

```sh
# git clone https://github.com/USERNAME/REPO.git
Cloning into 'REPO'...
Username for 'https://github.com': foo
Password for 'https://foo@github.com':
```

> The prompt above is printed by the `git` process itself. This behavior can be overridden, allowing arbitrary external process
> to generate the prompt or dialog instead. See `man 7 gitcredentials` for details.

Typing the username and password every time is obviously annoying.
git provides 2 ways to alleviate this:
1. git config file can have a `[credential <URL>]` section within which the username can be fixed;
  This is not very interesting since you still have to type the password every time.
2. use a credential helper
