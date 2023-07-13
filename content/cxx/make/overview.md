---
title: "Makefile Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - GNU
    - make
    - Makefile
---

The `Makefile` language can be divided into 2 parts, a dependency description language,
and a scripting language including constructs like functions, variables, loops, branching etc.

The purpose of the scripting part of a Makefile is to
1. determine the value of variables at run time, which can be expanded in the dependency part.
2. conditionally enable or disable certain rules in the dependency part

The mixture of 2 languages in the same `Makefile` renders it a rather weird creature for beginners.

## include other makefiles

The `include` and `-include` directive instructs the parser to parse the mentioned files as if their content replaces the `include` directive. (Not really, see below.) The parsing of the current file is paused until the replacement is done. There is no more ad-hoc treatment.

This indicates that the paths (including targets and dependencies) within the `include`-ed files are interpreted relative to the CWD of the `make` process that is parsing the `include`-ing Makefile.

```makefile
# Multiple files can appear in the same directive, order respected.
# wildcard works
include Makefile.other foo *.mk $(bar)

# the `-include` variant won't cause an error if mentioned files is not found
# Read auto.conf if it exists, otherwise ignore
-include include/config/auto.conf
```

If the specified file name does not start with a slash (i.e. a relative path),
- it is located relative to the CWD; if not found,
- it is searched in the directories given by the `.INCLUDE_DIRS` variable, which is populated by
    1. path supplied by the `-I` option
    2. path hardcoded into the `make` program at its build time

Eventually,
1. If the included file is found, its current content is read (which may contain rules to remake itself), without immediately considering its up-to-date-ness;
2. If the included file is still not found, it's not immediately an error. In some workflow, the Makefile is generated from some other source.

Once Make has finished reading Makefiles, it will try to remake any that are out of date or don't exist.
Make will raise a fatal error only after no rule is found to remake a non-existing Makefile.
This means Make needs to distinguish between files, instead of simply replacing `include` with the file content.

In the following example from the Linux kernel, the rules to remake `include/config/auto.conf` and `include/config/auto.conf.cmd` will be triggered before including these 2 files if the `$(KCONFIG_CONFIG)` (expands to `.config`) file has been modified after the previous generation of these 2 files.

```makefile
include include/config/auto.conf
include include/config/auto.conf.cmd

%/config/auto.conf %/config/auto.conf.cmd %/generated/autoconf.h %/generated/rustc_cfg: $(KCONFIG_CONFIG)
	$(Q)$(kecho) "  SYNC    $@"
	$(Q)$(MAKE) -f $(srctree)/Makefile syncconfig
else
```

<!-- ----------------------------------------------------------------------------------------------------------------------------- -->

