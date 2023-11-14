---
title: "Introduction to GitHub Personal Access Token"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Historically, when using an `https` remote URL to Github, one must provide the username and password for operations that require [authentication](./credentials.md).

Since Aug 13, 2021, Github stopped the classic username-password authentication when talking to its git remotes via `https` scheme,
in favor of its new Personal Access Token service:

```
remote: Support for password authentication was removed on August 13, 2021.
remote: Please see https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
fatal: Authentication failed for 'https://github.com/chaconinc/DbConnector/'
fatal: clone of 'https://github.com/chaconinc/DbConnector' into submodule path '/DbConnector' failed
```

> If the only reason a https remote is preferred is because ISP banned the SSH port, you may want to try [SSH over port 443](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port).

GitHub provides 2 types of Personal Access Token (PAT):

- classic PAT

    This is the equivalent of the legacy username-password combo.

    A class PAT will suffice for all daily remote operations that require authentication.

- Fine-grained PAT

    A fine-grained PAT is strongly associated with a GitHub user or organization, s.t.
    only repos owned by that user/organization can be accessed via the token.

    Cloning other people's public repos on GitHub via a fine-grained PAT is not allowed.

## Generate & Use a Classic PAT

Create and manage classic PAT at https://github.com/settings/tokens/

A PAT looks like `ghp_PKDYyo5frcRQVymUjZI8xxxxxxxxxxxxxxxxxxx` and will be only displayed once after generated.

This token must be input as the password when prompted, while the username input is ignored; since
the token by itself identifies your ownership of your GitHub account.

```sh
git clone https://github.com/USERNAME/REPO.git
Cloning into 'REPO'...
Username for 'https://github.com': foo
Password for 'https://foo@github.com':  # paste your token here
remote: Repository not found.
fatal: repository 'https://github.com/USERNAME/REPO.git/' not found
```

Storing the token and paste every time prompted sounds cumbersome.
[Credential helpers]({{<ref "./credentials.md">}}) are git's official solution to this.