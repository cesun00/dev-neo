---
title: "Overview: Java 9 Modules as a New Language"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Java 9 introduced a modularization system and used it to modularize the JDK itself.
This series of articles aims to provide all the information necessary for a Java developer to work with the module system.

We will first pretend Java 9 is a new language and module-orientation is the only development paradigm:
1. This article is a quick demonstration of modularized Java development workflow.
2. After the workflow is explained, readers are encouraged to go on to [Java 9 Module in Depth]({{<ref "./module-in-depth.md">}}),
3. [The Module Descriptor]({{<ref "./module-descriptor.md">}}), for details of the `module-info.java`, and how its directives affect the interaction between modules.

Finally, [The Imperfect World]({{<ref "./the-imperfect-world.md">}}), where we step back to the real world and discuss how modules and non-modular code co-exist.

Java 9 as a new language
==============

The source of the demo in this chapter is available [here](https://github.com/cesun00/cesunio-java-9-module-demo).

A Java 9 program is organized as classes.
Classes are grouped into packages, and packages are grouped into modules.
A module is one of the following structures:

1. a JAR or JMOD file whose root has a `module-info.class` file. (known as a module artifact)
2. a directory with a `module-info.class` file. (known as an exploded-module directory)

## 1. Develop modules

A module is the minimal unit of development.

We will use the following structure, where 2 modules are developed:

```
$ tree -I .git -a --gitignore
.
├── .gitignore
├── Makefile
├── README.txt
└── src
    ├── com.foo
    │   ├── com
    │   │   └── foo
    │   │       └── app
    │   │           └── App.java
    │   └── module-info.java
    └── org.bar
        ├── module-info.java
        └── org
            └── bar
                └── libfoo
                    └── PathFinder.java

10 directories, 7 files
```

Conventionally, a module is named in reverse-domain style like packages. The name of the containing directory of a module must be identical to the module name, i.e. the name declared in `module-info.java`. Thus it's an error to nest modules like `src/com/foo/module-info.java`. You simply create `com.foo/` and directories of other modules at the same top level.

Any type defined in other modules must be visible to your module before you can mention it in your source.
This is done by:
1. the external module's `module-info.java` declares an `exports` for the package containing that type; and
2. your `module-info.java` declares a `requires` on that external module.

In the example above, `class App` calls a method in `PathFinder`, so the following config is mandatory:

```java
// com.foo/module-info.java
module com.foo {
    requires org.bar;
}

// org.bar/module-info.java
module org.bar {
 exports org.bar.libfoo;
}
```

## 2. compile

A module is the minimal unit of compilation.

Invoke the following to compile your modules:

```
javac -d out --module-source-path src -m com.foo,org.bar <options>
```

where `-d` specifies the output directory, `--module-source-path` specifies where to find project source modules,
 and `-m` stipulates which modules to compile. It's an undefined behavior if any of these 3 options are missing.

## 3. Package

This stage is mandatory for an executable module, but optional for other modules if you will only them as libraries and keep them as an exploded directory.

An executable module is a module whose `module-info.class` encodes the main class name, thus can be executed by JVM without specifying a main class over CLI.

You can always package each module by:

```
jar -c -f app.jar --main-class com.foo.app.App -C out/com.foo .
jar -c -f lib.jar -C out/org.bar .
```

If you decide not to package `lib.jar`, you can replace its appearance below with `out/org.bar`.

If you decide to link your own custom JRE in the next section, you have the option to, instead of packing modules in vanilla JAR format, pack them in the new JMOD format:

```
jmod create --class-path out/com.foo --main-class com.foo.app.App app.jmod
jmod create --class-path out/org.bar lib.jmod
```

By design, the JVM doesn't understand the JMOD format,
JMOD is designed to be a compile-time- and link-time-only storage format, and can't be used at runtime.
You should not use JMOD packages unless you are going to build your own JRE.

## 4. (optional) link

The link stage aims to create a custom minimal JRE that is barely large enough to run specific application modules.

This is done by invoking the `jlink` tool:

```
jlink --module-path app.jmod:lib.jmod --add-modules com.foo,org.bar --output myimage
```

Once the image is built, the `myimage` directory can be moved anywhere, and will still work.

## 4. run

Running a Java 9 program means running an executable module, which will execute the `main()` method of the declared `ModuleMainClass`:

- If you omitted the link stage, and are using the stock image of a standard JDK release, you can do this by:

    ```
    java -p app.jar:lib.jar -m com.foo
    ```

- If you've generated your own JDK image, the command can be simplified since our 2 modules are merged into its `lib/modules`:

    ```
    myimage/bin/java -m com.foo
    ```