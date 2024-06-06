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
