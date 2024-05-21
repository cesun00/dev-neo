---
title: "Golang"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The Go programming language.

## Libraries Installation

Golang installs libraries (incarnated as packages in terms of go) on a per-user basis. There is no official support for system-wide packages installation as of this articles is written.

The directory into which all packages of a user is installed is determined by the `GOPATH` `go env` variable, whose default value is `~/go`.

## GO111MODULE

https://blog.golang.org/migrating-to-go-modules

A new concept of "module" was introduced in go 1.11 (2018-2-16) to serve as the unit of software/library distribution, as well as to create a native package management system directly supported by the `go` cli. To use `GO111MODULE`, a programmer creates a file named `go.mod` in a directory, and that directory should be the root of your project and the root of your git repo, with the exception that a git repo contains 2 versions of the same repo (todo).

Source file put in the same directory of `go.mod` will be of the root package of the module. The import path of the root package is just the module path.

Modules:
- are unit of distribution tagging a version
- make dependency management explicit and clear.

Historically go project source code must reside under `~/go/src`. This was not enforced anymore with the introduction of module.

## build / install
