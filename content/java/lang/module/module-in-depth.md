---
title: "Java 9 Module in Depth"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article explains the mechanism behind the [introductive demo]({{<ref "./_index.md">}}) and offers comprehensive insights into the Java 9 module system.
We will still pretend that non-modular code doesn't exist.
See ["The Imperfect World"]({{<ref "./the-imperfect-world.md">}}) for how non-modular code comes into the picture discussed in this article.

The term *module definition* will be used to refer to either
1. a JAR or JMOD archive holding a module; or
2. an exploded directory of such a JAR or JMOD

Module Path & The Universe of Observable Modules
============

`javac`, `jlink`, and `java` are invoked at 3 important phases in the lifespan of a Java module, namely the compile time, link time, and run time.

Invocation of these 3 tools shared the same paradigm of first specifying where to find modules (source or binary), and then certain operations (e.g. compilation, linking, loading) can be specified in terms of simple module names without worrying about filesystem structure.

*(if you are familiar JDK 8's usage of first specifying classpath then speak only fully-qualified class names, this is the same practice)*

These locations to find modules, despite being used in different phases and by different tools, are generally referred to as a *module path*.

A module path is a colon-separated (semicolon-separated on Windows) string where each item is either
1. path to a module definition (i.e. the JAR or exploded directory); or
2. path to a directory that directly contains module definitions; In this case, it's an error to have 2 modules of the same name in the directory.

For a single module path, its items are inspected from left to right when searched for a module by its name,
and the first occurrence will take precedence.

In practice, different tools have different options where more than 1 module path can be specified.
Precedence also exists among these module paths. We will look into these tools one by one.

For convenience of discussion, the phrase *the universe of observable modules* is used to refer to 
all visible modules found on the module paths after precedence applies, given an invocation of a specific tool.

The Compiler `javac`
============

An invocation of the compile follows the patterns:

```sh
javac   --module-source-path ...    \       # mandatory, the *compilation module path*
        --upgrade-module-path ...   \       # optional, the *upgrade module path*
        --system ...                \       # optional, use alternative system module image
        --module-path ...           \       # optional, the *application module path*
        -m ...
```

where the 4 first options specify the *compile-time module paths*, and `-m` specifies the module to be compiled.

A module is searched in the following order:
1. `--module-source-path`, **must** be a directory whose direct children are module definitions. (i.e. the 2nd definition of module path)
2. `--upgrade-module-path`, if given. This module path is used to shadow certain modules over system modules.
3. *system modules*, defined as either
    1. `--system <path>`, if given; otherwise
    2. the default module image shipped with the JDK release will be used; in all current JDKs I'm aware of, it's the `lib/modules` file.
4. `--module-path`, if given. This module path is used to reference all compiled library modules.
