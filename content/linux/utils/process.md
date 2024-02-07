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

Normally, kernel doesn't ship process visibility control, i.e. everyone can see everyone else's process via `/proc`.

Without any args, `ps` mimics the vanilla BSD `ps`.

### selection

If multiple selector are used, the result is union-ed.

```sh
# select processes whose EUID=1000 
[cedo@juejueko] ~ $ ps U 1000 | wc
    152    1735   42120

# select processes whose EUID=1000, OR processes whose cmd name is exactly 'code'
# which, is not usually people want.
[cedo@juejueko] ~ $ ps U 1000 -C code | wc
    152    1737   42128
```

*`ps` alone can't achieve intersection for selectors.*
If that's desired, use `pgrep` to get a list of pid first.

Use `-N` or `--deselect` to negate the selection.

A list can be either comma-separated single shell token, or whitespace-separated single or multiple shell token(s).

- words (user name / login / pid, etc.) in a list are always logically union-ed.
