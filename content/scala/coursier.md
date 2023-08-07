---
title: "Couriser: the Application Store for Scala"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

https://stackoverflow.com/questions/76749090/why-is-coursier-needed-what-is-the-different-between-coursier-and-maven-sbt-g


A jar app is an executable jars.
A scala jar app is an jar app written in scala.

Coursier is the app store for scala jar apps.

What it can:
- installing scala jar apps (to a location preferably included in `$PATH`). including:
  - create convenient "launcher" for those jars
  - resolve & download all dependencies jar those apps needs.
- manages standalone JVMs of different vendors / versions used to run those apps.

What it **IS NOT / CAN'T**:
- It's not a generic app sotre for all jar apps for unknown reason. It ensure only scala jar app are installable, and reject all other JVM bytecode application.
- **Coursier is app-user-oriented. You don't need it to program Scala code.** Though scala suites can be installed by it.

## launcher

 which can be called from cli without typing `java -jar ...`.

## CLI
