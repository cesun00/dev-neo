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

These module paths define the compile-time universe of observable modules.

For each module to be compiled, an exhaustive list of its dependencies is first computed, before any class sources are parsed. The module to be compiled is known as the *compile-time root module*, and its `module-info.java` is parsed for all `requires` directives. Note that [the `java.se` module is always `requires`-ed](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.1):

> If the declaration of a module does not express a dependence on the java.base module, and the module is not itself java.base, then the module has an implicitly declared dependence on the java.base module.

For each `requires`-ed module name, its module definition must be found in the universe; They are added into the list of dependencies, and their `module-info.{java|class}` are also read for `requires` directives. This happens recursively for the dependencies of dependencies, until no new module can be reached and added to the list. This well-known algorithm has a name for computing the [*transitive closure*](https://en.wikipedia.org/wiki/Transitive_closure).

Then `javac` begins to compile each `.java` source in the module into class files.
It's a compile-time error if any type mentioned in the sources is from a package that is not `exports`-ed by any module in the transitive closure.

The "Linker" `jlink`
==============

Despite its name, [the Java linker](https://openjdk.org/jeps/282) `jlink` is very different from a native OS object file linker. Given a compiled executable module, the only purpose of `jlink` is to create a standalone minimal JRE directory that contains everything you need to run that module.

An invocation of `jlink` takes the following form:

```sh
jlink   --module-path ... \         # mandatory, the only module path
        --add-module a,b,c,...      # mandatory, the root modules
        --output dirname            # mandatory, the output directory
```

Transitive closure is first computed in the same way as discussed above, where
`--add-module` specifies the *link-time root modules*, i.e. starting points of the algorithm.

The output directory is mostly formed by simply copying files from the JDK release `jlink` belongs to,
including the `java` executable and other runtime libraries crucial for JVM. The exception, and the
essential reason one wants to create a customized JRE, is the `lib/modules` [module image file]({{<ref "./modularized-jdk.md#module-image">}}). Only modules in the computed transitive closure get into the module image,
meaning that there is a good chance unused JDK modules are excluded:

```sh
$ du -h myimage/lib/modules $(dirname $(which java))/../lib/modules
29M	    myimage/lib/modules
136M	/home/user/.jdks/azul-21.0.1/bin/../lib/modules
```

Executable Module
=============

Any Java program starts running from a main method whose containing class is known as a main class.
There is a problem fitting this class-grained practice into our module-oriented Java 9+, because we want to keep the
consistency and say "Just run a module".

There are 2 obvious solutions:
1. specify the main class of a module somewhere along with the module release; running a module would then be running that main class. 
2. break the module encapsulation and specify the main class of the module on the command line.

Both are supported by Java 9 and later, but the second way, though breaking consistency, seems to be more popular these days, since it only requires typing on the CLI:

```sh
# java -m module.name/class.name
java -m com.foo/com.foo.app.App
```

Let's take a look at the first solution since its support in the current JDK 21 is somewhat peculiar.
As you may have guessed, `module-info.class` can store the full qualified main class name of the module,
and will be respected by JVM when CLI invocation doesn't give a main class:

```sh
java -m com.foo
```

