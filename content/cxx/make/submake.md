---
title: "Sub-Make"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- make
- Makefile
---

The term *sub-make* refers to the practice of having a recipe (executed by your shell) that `fork-exec` another `make` process.

Of course, you can do this by:

```makefile
do-submake:
    cd submodule && make
```

That's it. There is no more magic in the term `sub-make`.

The recipe is completely interpreted by the shell: `cd` into another directory and run a `make`.
However, the rule above indeed has some flaws, although not absurdly wrong.

It is recommended to:

```makefile
do-submake:
    cd submodule && $(MAKE)
```

`MAKE` is a variable that expands to `argv[0]` of the `make` process, i.e. the program name by which `make` is invoked, without any arguments.
This guarantees that sub-make will use the same `make` program along the calling hierarchy, avoiding the potential of `make` being resolved to another 
program on the `PATH`. There is nothing special about the `MAKE` variable other than that it is set by `make` itself upon startup. You can change `MAKE := whatever` and break the whole `Makefile`.
