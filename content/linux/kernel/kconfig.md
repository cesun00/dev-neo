---
title: "The Kconfig Kernel Option System"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The Kconfig system and all the `Kconfig` text files solely serve the purpose of assisting in the generation of the `.config` file.
It has nothing to do with the Makfile-based build system, which is discussed in [the Kbuild System]({{<ref "./build.md">}}) article.
If you prefer skipping the config step by using an old `.config` file, the `Kconfig` files don't matter anymore.

<!--more-->

`Kconfig` files are read by the various `*conf` programs as config files to generate prompts or TUI / GUI wizard.
There are `conf`, made and executed upon `make config`, and `mconf` by `make menuconfig`. Recent versions of kernel add QT and GTK-based wizards.
These wizards culminate in a `.config` (and its header and Makefile variants) generated.

Don't get confused with `Kbuild` files, which are Makefile snippets.

## The `Kconfig` language

The `Kconfig` language consists of 2 parts: a macro langauge for text substitution, and a DSL for describing kernel build configs options and their dependency.

Various config programs (e.g. `menuconfig`)
`Kconfig` files are executed in 2-pass:
`Kconfig` files are first scanned for replacing macros with values, and in the second pass, the macro-expanded intermediate form is parsed for structure analysis and dependency description.

