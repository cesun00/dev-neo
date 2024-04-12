---
title: "On the Kernel Build System"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article analyzes the build process of the Linux kernel, including the implementation of `Makefile`s.
Various build-time generated files and build techniques are discussed.

> 这 Kbuild System 啊，看3行不关掉都是神人了。

<!--more-->

The following pseudo-code briefly describes the root Makefile:

```go
func make_single(target) {
    load Kbuild.include utils
    load ARCH SRCARCH ...
    set compiler include path

    load include $(srctree)/scripts/Makefile.compiler

    if (target matches '*config') {     // config-build
        make -f `script/Kconfig/Makefile` *config
    } else {
        // non config build includes
        // 1. real vmlinux or modules
        // 2. arch-specific targets
        // 3. clean
        // 4. ...

        load include/config/auto.conf (.config as Makefile variables)
        load $(srctree)/arch/$(SRCARCH)/Makefile
        load include/config/auto.conf.cmd
        
        compiler flag adjustment, depending on 

        if (`make M=...` or `make KBUILD_EXTMOD=...` set) {
            `__all: modules`: default goal is to build `modules`
        } else {
            `__all: all`: default goal is to build `modules`
        }
    }
}


func make(targets, need-submake) {
    if (need-submake = 1) {
        make(targets, 0)
        return;
    }

    for each (target in targets)
        make_single(target)
}
```

It is well-known that the Linux kernel can (and should) be built by `make *config` followed by a `make` call without goal.
The `make` interface is versatile and assumes jobs of different nature (clean, generate configs, build modules, build the vmlinux), bringing
complexity to the implementation of `Makefile`s. 

## `script/Kbuild.include`: utilities

`script/Kbuild.include` is included by the root Makefile at an early stage to provide utility functions.
This section discusses the most important ones.

### `cmd`: print and execute commands

```makefile
# $(call cmd, foo):
#
# with echo supressed:
# if `cmd_foo` exist, 
#       print either `quiet_cmd_foo` or `cmd_foo` value as string
#       trap interrupt
#       call cmd_foo
# else
#      no-op
cmd = @$(if $(cmd_$(1)),set -e; $($(quiet)log_print) $(delete-on-interrupt) $(cmd_$(1)),:)
```

The `cmd` function should be used when you want to perform certain operations and print to the terminal a message.
