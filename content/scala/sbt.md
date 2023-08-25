---
title: "SBT for Scala"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

`sbt` (Simple Build Tool) is Scala's project management tool, the equivalent of `maven` to Java.

It's recommended to [get a binary release from Github](https://github.com/sbt/sbt/releases).

SBT is written in Scala and binary-released as a `sbt-launcher.jar` (around 3 MiB).
The `sbt` command is a shell script wrapper that runs this jar on JVM by running `Main-Class: xsbt.boot.Boot`, or downloads this jar into `$HOME/.cache/sbt` from the maven repo if missing as a sibling file.

The first run of `sbt` will download a Scala runtime dedicated to running SBT into `$HOME/.sbt/`.

https://stackoverflow.com/questions/38934642/why-does-sbt-download-a-different-scala-version-than-the-one-in-build-sbt
