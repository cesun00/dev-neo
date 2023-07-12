---
title: "Git Internals"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This section explores the internals of the git version manager.

## Overview

Git hides all its secrets in the `.git` directory in the repository root.
The following is what this directory looks like, with non-essential files omitted:

```sh
# .git << GIT_DIR! >> $ tree -F
./
├── branches/
├── COMMIT_EDITMSG      # the temporary file used the last time you call `git commit` without `-m` option
├── config              # repository-specific git config
├── description         # human-readable description of this repository; meant to be edited by repo maintainer.
├── FETCH_HEAD
├── HEAD
├── hooks/              # callback shell scripts
│   ├── applypatch-msg.sample*
│   ├── commit-msg.sample*
│   ├── ...
├── index               # the index file: staged snapshot to be committed
├── info/
│   └── exclude
├── logs/
│   ├── HEAD
│   └── refs/
