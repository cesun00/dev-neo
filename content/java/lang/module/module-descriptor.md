---
title: "Core of the Module System: The Module Descriptor"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article discusses the module descriptor and the interaction between modules wrt. declarations in the module descriptor. Readers are assumed to be familiar with [the basic workflow of Java 9 modules]({{<ref "./_index.md">}}).

The whole Java 9 module system rotates around module metadata declared in a special file located at the root of each module. The file must be named `module-info.class`, and must be compiled from a source file named `module-info.java` by the `javac` compiler during the compilation of a whole module.
The term *module descriptor* can refer to either the source or compiled binary, depending on the context.

The module descriptor source conforms to the `ModuleDeclaration` structure as defined by JLS, where each semicolon-terminated java-statement-alike line is known as `ModuleDirectives`. This article will use the term "directive" for such lines.

Our discussion will be based on the following pseudo-code listing all possible directives in a module
descriptor:

```java
[open] module module.A {
    /**
     * Allow code in this module to refer to `exports`-ed package 
     */
    requires module.B;                      // compile-time + run-time dependency
    requires static module.B;               // compile-time dependency only
    requires transitive module.B;           //
    requires static transitive module.B;    //

    /**
     * Export package to every other modules or only to certain ones such that `requires`
     * from their module-info.class
     */
    exports package.X;
    exports package.Y to module.B, module.C, ...;

    
    /**
