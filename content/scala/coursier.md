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

Its only cli is called `cs` by convention, but sometimes `coursier`.

Coursier is written in scala, and has [release](https://github.com/coursier/launchers) in both 
1. a cousier application
   1. `coursier` weights about 150KB and requires Internet on the first run to download some jars.
   2. `coursier.jar` weights about 40MB and doesn't requires initial downloads. see [faq](https://get-coursier.io/docs/faq)
2. and a single OS-native binary executable. the linux one weights about 60MB.

## application coordinates

Some takes short application name whose app descriptor can be obtined from a given channel, but there are othe cases where a complete artifact coordinates must be given:
1. when specifying the JAR channel jar itself
2. when no application descriptor json are publicly available; e.g. installing a pure java jar for scala code to use.
3. 

Coursier extends maven's coordiante by ...

```
group:app-name:version     # for java module
group::app-name:version     # for scala module
group:::app-name:version     # for cross-version scala module

```

## shared maven central

Under the hood, coursier uses the maven's coordinate (group-artifact-version) model, resolve dependencies, then access maven repo to download the jars.  Since the whole scala suite is also published as maven artifacts (under the `org.scala-lang` group), coursier can also be used to download / install the scala suite itself.

By default, Coursier 
- installs executables in `$HOME/.local/share/coursier/bin`; can be changed by `--dir <DIR>` (or equivalently `--install-dir <DIR>`) per `cs` cli invocation. It's recommended to add whatever installation directories to `PATH`.
- keep dependencies maven jar in `$HOME/.cache/coursier/v1`; can be changed by `--cache <DIR>` per `cs` cli invocation. Coursier calls these jars "cache" which can be confusing: they are permenantly stored, and seldomly deleted.
- keep JVMs in `$HOME/.cache/coursier/jvm`

## official scala suite executables management

Currently the scala suite consists of 37 executables, which are also script-prepended jars.

These are commands that install / manages locally installed ones:

```sh
cs list
cs search [<keyword>]
cs install <appname>[:<version>]
cs update [<appname>]
cs uninstall [<appname> | --all]
```

- `search` command search available executables by keywords. Without keyword it dumps an exhaustive list of known remote executables
- `list` lists installed executables.
- `install` command installs an . **Installing a different version of the same application will overwrite the locally existing one**
- `update`

## application descriptor

## channel

A channel is a collection of application descriptor `.json` files. 

A channel is any of:
1. a collection of `.json` files available under the same remote HTTP url path prefix.
2. a collection of `.json` files available under the same local filesystem directory
3. a `jar` file downloadable via HTTP. containing flat `.json` files at its root. This one is indeed bizarre - `jar` is used as archive of text files.

By default, a `cs` invocation use a single channel `io.`


## packaging

### script-prepended jar

Jar file use the zip format, which by design allows prepending
arbitrary data before the zip magic number, and mandates all zip parser implementations to ignore those data. see [wiki](https://en.wikipedia.org/wiki/ZIP_(file_format)#Design).

This allows a technique to run an executable jar by `./foo` as if it's a real executable, without user typing `java -jar foo.jar`:

1. build the good old executable jar and name it without `.jar` extension
2. prepend shell script that prepare the environment and eventually calls `exec java <jvm_args> -jar foo`.

Now for the user
1. explicitly typing `java <jvm_args> -jar foo` still works, since `java` will ignore the prepended scripts when extracting jar file.
2. can just `chmod a+x foo` and `./foo`. 
    - If JVM arguments are needed, `JAVA_OPTS` envvar always works.

Coursier makes extensive use of this technique. All executables installed by `cs` is a script-prepended jar, referred to as *cousier application* below. Their scripts always collects `-J` prefixed argument as `<jvm_args>` to differentiate from program arguments. e.g. `./foo -J-Dkey=value -J-Xmx2048m progarg1 progarg2`.