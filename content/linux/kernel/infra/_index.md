---
title: "Linux Kernel Infrastructure"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The general infrastructure of the Linux kernel is discussed, including:
- locking
- data structures
- misc memory operation utilities
    - one-off read / write (`include/asm-generic/rwonce.h`)

## MISC UNCLASSIFIED

### error report

```c
// kernel/fork.c

if ((clone_flags & (CLONE_NEWNS|CLONE_FS)) == (CLONE_NEWNS|CLONE_FS))
		return ERR_PTR(-EINVAL);
```

```c
// include/linux/err.h

/**
 * ERR_PTR - Create an error pointer.
 * @error: A negative error code.
 *
 * Encodes @error into a pointer value. Users should consider the result
 * opaque and not assume anything about how the error is encoded.
