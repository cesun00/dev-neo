---
title: "Make - Performance Consideration"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - GNU
    - make
    - Makefile
---

### prevent useless rules from getting into the intermediate form

```makefile

# figure out when it's necessary to active certain rule
# and guard heavy rules with the variable

ifdef may-sync-config

# a heavy rule that depends on more than 1500 files
# unconditionally have this rule will cause make to `stat` each dependency files
heavy_rule: foo bar ...

# or put in an separate file for clarity
include include/config/auto.conf.cmd

endif
```

### Pre-compute Dependency Closure for Make

???

```makefile
deps_kernel/sysctl.o := \
    $(wildcard include/config/SYSCTL) \
    $(wildcard include/config/X86) \
    $(wildcard include/config/SPARC) \
    $(wildcard include/config/RT_MUTEXES) \
    ...
    # omitted 1800 lines of dependencies

kernel/sysctl.o: $(deps_kernel/sysctl.o)

$(deps_kernel/sysctl.o):
```