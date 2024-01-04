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
