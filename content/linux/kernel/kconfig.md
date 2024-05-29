---
title: "The Kconfig Kernel Option System"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The Kconfig system and all the `Kconfig` text files solely serve the purpose of assisting in the generation of the `.config` file.
It has nothing to do with the Makfile-based build system, which is discussed in [the Kbuild System]({{<ref "./build.md">}}) article.
If you prefer skipping the config step by using an old `.config` file, the `Kconfig` files don't matter anymore.

<!--more-->

`Kconfig` files are read by the various `*conf` programs as config files to generate prompts or TUI / GUI wizard.
There are `conf`, made and executed upon `make config`, and `mconf` by `make menuconfig`. Recent versions of kernel add QT and GTK-based wizards.
These wizards culminate in a `.config` (and its header and Makefile variants) generated.

Don't get confused with `Kbuild` files, which are Makefile snippets.

## The `Kconfig` language

The `Kconfig` language consists of 2 parts: a macro langauge for text substitution, and a DSL for describing kernel build configs options and their dependency.

Various config programs (e.g. `menuconfig`)
`Kconfig` files are executed in 2-pass:
`Kconfig` files are first scanned for replacing macros with values, and in the second pass, the macro-expanded intermediate form is parsed for structure analysis and dependency description.

###  macro part

Like Makefile, variables are defined with `:=` or `=`, appended to with `+=`, and referenced via `$(foo)` syntax. (`${foo}` and `$foo` are both illegal).

A variable can contain `$(n)`placeholders. The expansion of such variables can take arguments which will replace the placeholders:

```makefile
foo = hello $(1) world $(2)! $(3)       # must use `=`, not `:=`

bar := $(foo,arg1,arg2,arg3)   # which expands to `hello arg1 world arg2! arg3`
```

A variable can hold 





## toxic

1. `config` without a `prompt` string will never show up in `menuconfig` or `guiconfig`, not even in `EXPERT` mode and when their dependencies are satisfied.
Such 
2. a symbol's position in the `menuconfig` is determined in 2 ways:
    1. an explicit `menu "title" ... endmenu` wraps all middle `config`s in an menu
    2. analyzing the dependencies. if an `config` has only 1 `depends on`, meaning that it will only be visible if that `depends` is visible, a submenu will be made   https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html#menu-structure

## pattern:  overrides archtecture-specific override

`arch/$(SRCARCH)/Kconfig`

{{<columns>}}

#### arch/Kconfig

```
config HAVE_GENERIC_IOMAP

config GENERIC_IOMAP
      depends on HAVE_GENERIC_IOMAP && FOO
```

<--->

#### arch/x86/Kconfig

```kconfig
config X86
      select ...
      select HAVE_GENERIC_IOMAP
      select ...
```

{{</columns>}}

## main

Various kernel source tree directories contain a `Kconfig` file.
This article discusses their syntax and role in the kernel build flow.

Ultimately, the purpose of Kconfig system is to generate a `autoconf.h` header filled with `#define CONFIG_*` 
instruction the preprocessor the perform conditional compilation correctly.

<!--more-->

<!-- `Kconfig` files are static text files. They are manually maintained and won't change by a build. 
Kernel users shouldn't modify these `Kconfig` files unless hacking.


They hierarchically organized build options, and are used to generate config wizards.

For almost each source subdirectory, the kernel tree ships a `Kconfig` file. 
Those files are used to generate a hierarchical `menuconfig`.

- The designed of Kconfig is largely `menuconfig` oriented, tightly coupling the kconfig syntax with the UX of `menuconfig`.
- The idea of Kconfig is to synchronize these 3 structures:
    - the hierarchy of the source tree
    - the distribution of `Kconfig` files, i.e. one `Kconfig` per subdir, and upper one `source` lower one.
    - `menuconfig` TUI folders
- 

The generated config is `.config` at the root of the source tree.

```
                       user
                        |
                        V
Kconfig -> interactive configuration wizard
                        |
                        V
        .config & include/generated/autoconf.h
``` -->

1. Macros in `Kconfig` files are evaluated, their result are substituted forming an intermediate `Kconfig` files
2. intermediate `Kconfig` files are used to generate config wizard


```kconfig
source "arch/$(SRCARCH)/Kconfig"

# arch/x86/Kconfig

config 64BIT
	bool "64-bit kernel" if "$(ARCH)" = "x86"
	default "$(ARCH)" != "i386"
	help
	  Say yes to build a 64-bit kernel - formerly known as x86_64
	  Say no to build a 32-bit kernel - formerly known as i386
```

## Macro Expansion

Macro was designed to resemble the GNU Make variables. Variable reference and external program is all done in `$()` syntax. `${}` is not a valid syntax.

- `foo := bar` introduces a *simply expanded variable*, where the righthand side is expanded immediately upon reading the line from the Kconfig file.
- `foo = bar` introduces a *recursively expanded variable*, where `foo` stores the literal string on the righthand side without expanding it in any way. Instead, the expansion is performed when the variable is used.







## Kconfig Language Syntax

Top level keywords are:

- `mainmenu`

    Only allowed at the top of the root `Kconfig` file.

    Hint for the title of TUI or GUI config tools. Whether this value is respected is up to the parser.

    ```
    mainmenu "Linux/$(ARCH) $(KERNELVERSION) Kernel Configuration"
    ```

- `source <path>`
- `comment`
- `menu ... endmenu`
- `choice ... endchoice`
- `config <name>`

    Will generates a `CONFIG_<name>` entry in `.config`.

    ```
    config POSIX_MQUEUE
	bool "POSIX Message Queues"
	depends on NET
    ```

- `menuconfig`
- `if ... endif`

### `config` attributes

- type: `bool | tristate | string | hex | int ["optional prompt"]`

    Mandatory. Declare the type of this config.
