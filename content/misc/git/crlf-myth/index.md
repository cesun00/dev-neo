---
title: "CRLF Myth: the end-of-line conversion"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

> warning: in the working copy of 'content/git/git-shell-prompt.md', LF will be replaced by CRLF the next time Git touches it
> warning: in the working copy of 'assets/css/extended/columns.css', LF will be replaced by CRLF the next time Git touches it
> warning: in the working copy of 'layouts/shortcodes/columns.html', LF will be replaced by CRLF the next time Git touches it

`git` is line-oriented, meaning its diff algorithm does not track changes within a line, but considers a line to be overwritten completely when changes happen there; defining what a line is thus crucial to its functioning.

Traditionally, `git` works on *NIX system where newlines are separated by a single `0x0A` ASCII character known as `LF` (line feed).
This holds for all:
1. active files in the repo stored as-is on the filesystem (known as the working directory); and
2. `git add`-ed files snapshots (known as the staging area); and
3. files archived in any historical git commits (known as the local repository).

This becomes a problem when git is ported to systems that use other characters as a line separator.
Specifically, if git operations that modify the working 

 stores end-of-line into the repository using whatever char sequences on the filesystem of the committer,
People who cooperate on the same project will find a file.

The strategy

Git provides 3 options to help alleviate this problem:

{{<wide>}}
{{<include-html "./options.html">}}
{{</wide>}}