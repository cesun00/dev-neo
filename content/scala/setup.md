---
title: "Scala Development Setup"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Scala is a high-level programming language that compiles to bytecode and runs on the JVM.

The Scala compiler itself is written in Scala and binary-released as JVM bytecode (JAR files).

Scala currently has 2 incompatible major versions maintained, Scala 2 and 3. 
As of this writing, the latest minor versions are:
- Scala 2.13.14
- Scala 3.4.2

It is always recommended to download a Scala binary release from [the GitHub release page](https://github.com/scala/scala3/releases).
Some Linux distros may choose not to provide official packages of Scala development suites.
Building from source is not recommended for beginners as building the language suites itself requires `sbt`.

The binary release contains a `lib/` directory of JARs only (known as the Scala runtime), and a `bin/` directory of 3 executable shell scripts:
- `scalac`: the compiler launcher script
- `scala`: the runner launcher script; run a compiled `.class` or launch the REPL.
- `scaladoc`

A scala source file `Foo.scala` is compiled into Java bytecode by the `scalac` command, and then run by the `scala Foo` command.
Under the hood:
- `scalac Foo.scala` delegates to `java dotty.tools.MainGenericCompiler Foo.scala`
- `scala Foo` delegates to `java dotty.tools.MainGenericRunner Foo`

## Run a Scala Program

Scala program could be run by simply calling `java`, given that you've put all Scala runtime JARs correctly on the JVM classpath.

To make life simple, a `scala` script was provided to do this. On my deployment, this script invokes JVM by:

```sh
# todo: scala2


