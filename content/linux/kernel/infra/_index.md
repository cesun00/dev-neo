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
 *
 * Return: A pointer with @error encoded within its value.
 */
static inline void * __must_check ERR_PTR(long error)
{
	return (void *) error;
}

```

### x86 branch predicting instruction prefix generation

See [x86 branching hits](#TODO) for how this works in encoded x86 instructions.

```c
// tools/include/linux/compiler.h

#ifndef likely
# define likely(x)		__builtin_expect(!!(x), 1)
#endif

#ifndef unlikely
# define unlikely(x)		__builtin_expect(!!(x), 0)
#endif
```

use like:

```c
if (likely(!ptrace_event_enabled(current, trace)))
			trace = 0;
```