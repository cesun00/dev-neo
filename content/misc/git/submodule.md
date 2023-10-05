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
