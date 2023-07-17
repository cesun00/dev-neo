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

## Credential Helper

Credential helpers are pieces of code that are dedicated to storing and providing credentials when necessary.
`man gitcredentials(7)` says they are *external programs* but that's not always true. See below.

To use a helper, instruct `git config credential.helper <HELPER>` or equivalently in a git config file, [locally or globally](./configs.md):

```ini
[credential]
    helper = #<HELPER>
```

2 built-in helpers, `cache` and `store`,  are always available for Linux.
Depending on the git build for your operating system, more `<HELPER>` in [`contrib/credential`](https://github.com/git/git/tree/186b115d3062e6230ee296d1ddaa0c4b72a464b5/contrib/credential) may be available.

1. `git help -a | grep credential-`  will display available helpers for your build.
2. See https://git-scm.com/doc/credential-helpers for publicly known 3rd party helpers.

```sh
# keep typed username & password in a daemon's memory to avoid prompting in 5 minutes
git config credential.helper cache

# keep typed username & password in `~/.git-credentials` file forever
git config credential.helper store
```

1. the `cache` helper [does spawn a new process](https://github.com/git/git/blob/186b115d3062e6230ee296d1ddaa0c4b72a464b5/builtin/credential-cache.c#L109C4-L109C16) `git credential-cache--daemon` and later communicates with it via a UNIX domain socket; while
2. the `store` helper simply reads and parses the credential database file in the `git push / pull` process itself.

For more config details of these 2 helpers, see the man pages of `git-credential-store` and `git-credential-cache`.