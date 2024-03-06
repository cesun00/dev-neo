---
title: "Java Service Provider Interface (SPI)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

> For the sake of simplicity, this articles only discuss SPI in Java 8 and prior.
> SPI becomes even better since the introduction of Java 9 module. But the workflow is slightly changed.
> See [SPI with Java Module]({{./module/module-descriptor#enhanced-spi}}) for the complete picture.

SPI (Service Provider Interface) is Java's standard mechanism for discovering external implementations of a given interface at run time. Any caller of static method `java.util.ServiceLoader#load(Class<S> service)` obtains a `ServiceLoader<S>` instance.
A `ServiceLoader<S>` instance represents the collection of all implementations of interface `S` presented on the run time classpath, provided that they are exposed by the implementation vendor JAR in a well-known declaration file.

For each discovered implementation, a `ServiceLoader.Provider<S>` instance is constructed, which is simply a combo of the implementation `Class<SImpl>` and a lazy getter that returns an instance of that implementation. The `ServiceLoader<S>` instance holds the collection of such `Provider<S>`s and is ready to accept metadata queries or instantiation requests.

## DIY: a 4-parties scenario

[demo source](https://github.com/cesun00/cesunio-spi-demo)

## Motivation

A well-designed library should expose only interfaces to its clients. (interface used in its general sense)
Interfaces are contracts that seldom change.
Those code invisible to the client - the implementation details - can thus be improved without breaking the contract.

From the library authors' perspective, it is ideal that the client programmers program to interfaces or interfacial classes, to the extent that no implementation is even present during compile time. In practice, such a library is usually released as 2 different JARs. That is, `javac`'s classpath contains only the interfacial jar.

There are good reasons for doing so:
1. This prevents users from accessing internal APIs since downcasts to implementation won't compile;
2. When there are multiple implementation jars, the choice of implementation can be deferred to deployment time, perhaps made by a different person (DevOps Admin, instead of the application developer).
