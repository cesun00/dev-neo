---
title: "Overview on Git Configurations"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

A `git` CLI invocation search configs in the following order:

1. the system-wide config: `/etc/gitconfig` file; 

    For a git release for Windows, this file resides at `<GIT_INSTALLATION>\etc\gitconfig`, and essentially becomes an installation-wide config;
    the default `<GIT_INSTALLATION>` is `C:/Program Files/Git/`.

2. the user-wide config: `.gitconfig` in the user's home directory
3. repository-wide config: `.git/config` file

For a config entry of the same name, the one found in the latter location take precedence.

All these files use the same syntax which mimics the Windows `.ini` config file.

## Config Value Interpretation

The parsing of git options is designed with tolerance in mind.
Most git options are very tolerant of acceptable values.
For example, 

An option that can be set `true` or `false` can be set to `foo` without a warning.
