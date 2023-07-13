---
title: "Process Management CLI Utils"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## `pgrep`/ `pwait` / `pkill` from `procps-ng`

These 3 tools support rich condition search on processes.

pwait/pkill by pid is not supported.

### pgrep

`pgrep` always prints a delimiter-separated (configurable by `-d`) list of pid.

- Selectors are always logically intersected, i.e. all must match.
- List supplied to a single selector are always unioned.
- Use `-v` to negate the whole selector combination.

```sh
# select processes whose EUID=1000, AND processes whose cmd name is exactly 'code'
pgrep -u 1000 -x code
```

## `ps` from `procps-ng`

`ps` suffers from the curse of compatibility for multiple historical implementations.
[Some effort exists](https://github.com/dalance/procs), but there seems to be no wide-spreading replacement for it by 2022.
