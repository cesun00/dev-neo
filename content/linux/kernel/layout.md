---
title: "Kernel Source Layout"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
    - Linux
    - kernel
---

- Architecture-agnostic headers:`include/` & `include/uapi/`
- Architecture-agnostic headers created upon the generation of `.config`:`include/generated/` & `include/generated/uapi`
- Architecture-dependent headers: `arch/*/include` & `arch/*/include/uapi`
- Architecture-dependent headers: `arch/*/include/generated` & `arch/*/include/generated/uapi`

credit:
- https://stackoverflow.com/questions/18858190/whats-in-include-uapi-of-kernel-source-project
- https://unix.stackexchange.com/questions/353378/understanding-include-directory-in-the-linux-kernel

## The UAPI split

Prior to v3.7, 