---
title: "Introduction to Git Submodules"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

<!-- ```
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!

From github.com:cedric-sun/neo-cesun-hugo-dev
   26bed33..cd88bef  master     -> origin/master
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 535431e89abe2f7965b8816d7b692f75d8fbd0e8:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!

warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.path'. Skipping second one!
warning: 8d20aa5e6230a3787ae1d405df772b406b4c362c:.gitmodules, multiple configurations found for 'submodule.themes/hugo-papermod.url'. Skipping second one!
Fetching submodule themes/hugo-papermod
From https://github.com/adityatelange/hugo-PaperMod
   0dfff4e..01c333e  exampleSite -> origin/exampleSite
   b288ede..d6cd6d9  master      -> origin/master
Updating 733f9fd..34641a2
Fast-forward
 archetypes/foo.md                                              |   7 ++
 assets/css/extended/columns.css                                |  28 +++++++
 assets/css/extended/override-var.css                           |   3 +
 content/about.md                                               |  17 ++--
 content/arche/pdp-7.md                                         |  97 ++++++++++++++++++++++
 content/arche/unix-history.md                                  |  90 +++++++++++++++++++++
 content/autotools/_index.md                                    |  74 +++++++++++++++++
 content/autotools/autotools_flow.gif                           | Bin 0 -> 39961 bytes
 content/autotools/m4.md                                        |   5 ++
 content/changelog/index.md                                     
``` -->

## Overview

Depending on the programming language and ecosystem to work with, one may frequently find the need to include
the source of other projects directly in his repository. 
Good examples are the [Gnulib](https://www.gnu.org/software/gnulib/) and some `ffmpeg`-using applications
whose compilation requires a standalone copy of the ffmpeg source. Hugo, the SSG that generates this site, also has
a theme system that requires installing the source of a theme into local site repository.

The obvious solution of copying library sources into the working tree and committing them into the local repository
suffers from the problem of not being able to receive updates from the library upstream.

Submodules are git's standard mechanism to include a given version of other repositories as part of a root repository - your project.


```sh
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

This will add 2 entries into the stage index:

```sh
# git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   .gitmodules
	new file:   themes/PaperMod

```

```
ls -al
total 24
drwxr-xr-x  4 bitier bitier 4096 Jan  8 16:49 .
drwx------ 35 bitier bitier 4096 Jan  8 16:49 ..
drwxr-xr-x  9 bitier bitier 4096 Jan  8 16:50 .git
-rw-r--r--  1 bitier bitier  112 Jan  8 16:49 .gitmodules
-rw-r--r--  1 bitier bitier    9 Jan  8 16:35 REDME.md
drwxr-xr-x  3 bitier bitier 4096 Jan  8 16:49 themes
```


## Cheetsheet

```sh
# Register a new submodule for you repo

# Clone a repository that use submodules

# Delete a submodule

# Update 

```