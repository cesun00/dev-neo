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
3. This allows the separation of parties: API designers and implementation authors may come from different parties. The API jar is published before any implementation jar is released.

From the client's perspective, library instances are returned from factory methods by interface type,
which is the reason why you almost can't see constructor calls when using such a library.
The real challenge boils down to how such a factory method locates actual implementation instances of given interfaces at runtime.

In fact, the practice of separating API and implementation jars has long existed.
A good example is the JDBC driver, where a user programs to the `java.sql.*` APIs which are parts of standard JDK `rt.jar`; the vendor's implementation is only required at runtime, e.g. for MySQL it's `mysql-connector-java-8.X.XX.jar`.
At compile time, client calls `java.sql.DriverManager#getDriver` to obtain a `java.sql.Driver` reference, which refers to a `com.mysql.cj.jdbc.Driver` instance at runtime.

Let's see how the aforementioned challenge is solved traditionally:
`java.sql.DriverManager` maintains a static registry, a list of known `Driver` implementations:

```java
private final static CopyOnWriteArrayList<DriverInfo> registeredDrivers = new CopyOnWriteArrayList<>();
```

Each implementation vendor is expected to report their `Driver` implementation by adding an implementation instance to
this registry. This is always done by a static initializer. `mysql-connector-java` does the following:

```java
package com.mysql.cj.jdbc;

public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    // Register ourselves with the DriverManager.
    static {
        try {
            java.sql.DriverManager.registerDriver(new Driver());
        } catch (SQLException E) {
            throw new RuntimeException("Can't register driver!");
        }
    }
}
```

This workflow suffers from several problems:
1. It's the user's responsibility to ensure the static initializer is executed, making necessary the infamous `Class.forName()` call in the past. Such a contract is not common practice.
2. [The intrinsic problem with static initializers]({{<ref "notorious-static-init">}})
3. An implicit contract is also imposed on the `Driver` vendors: they have to read the specification and know what must be done in the static initializer.

SPI was developed to facilitate a workflow without these problems.

## How SPI works

Instead of relying on some esoteric static registration contract documented in the wild and varies from library to library,
SPI solves the aforementioned problems by formalizing the way an implementation is discovered, presented as follows:

1. For client user: one still obtains interface instances by calling factory methods from API JAR;
2. For API vendor: the factory methods discover implementations and obtain their instances at run time by calling static method `java.util.ServiceLoader#load`
3. For implementation vendor: implementation JAR exposes the full names of implementation classes in a well-known declaration file.
4. All the static registration magics are now extracted to `ServiceLoader`: instead of asking on implementation vendor to write ad-hoc code that register themselves, standard `ServiceLoader` now read the well-known declaration file and load those classes followed by instantiating an instance.

SPI is a complete "userspace" solution, meaning that there is no magic from the compiler or JVM involved. You can literally write your own `ServiceLoader` before the Java 6 one is introduced into standard JDK.

## More Than Discovery

Again, SPI is merely a standard way to expose & discover implementations;
and `ServiceLoader` is simply a helper class for whoever doesn't want to scan the classpath and read `META-INF/services/*` themselves.

1. In the classic SPI workflow, the impl instance is directly exposed to the end user for use. JDBC `Driver` is an example, where a user 
2. 


Arbitrary operations can then be done with that instance, including:
1. invoking implemented methods that run arbitrary code contained in the implementation. This is what Servlet 3.0 Specification does for `javax.servlet.ServletContainerInitializer`. Spring MVC receives a callback from Tomcat which in turn call implementations of its own interface `org.springframework.web.WebApplicationInitializer` from Spring user.
2. exploiting the side-effect that at the time of instantiation, the class static initializers are run. This is what `java.sql.DriverManager` does to ensure the registration of `Driver` implementation.

The term SPI is thus commonly abused

SPI is mainly used for 2 reasons:
1. allows client programmers to program against interfaces whose implementation doesn't exist at compile time, but will be discovered at run time; i.e. defers the choice of implementation to deployment time.
2. gives a chance where implementation jars can receive callbacks to self-initialization code, and do not rely on class static initializer. e.g. Spring MVC uses this feature to implement its `WebApplicationInitializer`.

## Overview

People extended the *Service Locator Pattern* to solve this. Vanilla SLP doesn't involve the static initializer where implementation class registering itself. The SLP-based workflow is as follows:

1. Client code call factory method to obtain an implementation of interfacial type, instead of `new` one by itself.

    This solved challenge #1. Factory method here might be static factory method or instance method on factory interface.

2. Interfacial jar maintains a `HashMap` known as "registry". At run time, client's call to the factory method will query the hash map for an known implementation instance, or ways to create one.
3. When the implementation jar is loaded by JVM at runtime, static initializer of certain classes in it "registers" the implementation object (or ways to create one) it provides into the registry.

It's client programmer's responsibility to ensure that the static initializer of that implementation jar class is executed. A Famous example is the JDBC driver, where in old days end user need to call `Class.forName()` to load the vendor's `Driver` implementation, which will executed its static initializer to register itself to JDBC driver registry by `java.sql.DriverManager.registerDriver()`.

JDBC 4.0 supports the new SPI workflow, as described below, thus `Class.forName()` isn't needed anymore.

## Java 6 Service Provider

Java 6 introduced a mechanism known as "service provider" to formalize and automate the above practice.

Some official vocabularies:
1. service provider interface: the collection of `interface`s / interfacial classes; They are in the interfacial jar.
2. service provider: the implementation jar; implementations of the SPI
3. service: client may or may not use service provider interface objects directly; Other than the interfaces to be implemented, everything else (e.g. the factory, the `ServiceLoader` holder class, the auxillary class method that operates on the SPI `interface`s) is the service. It's usually part of the interfacial jar.
4. provider-configuration file: files in the `META-INF/services/` directory

It's highly likely that the client programmer, the SPI, and the implementation (service provider) are from 3 different parties.

The service provider mechanics does not rely on class's static initializer. A new `java.util.ServiceLoader` class is introduced to help the SPI party to find all implementations of a specific `interface` at runtime.

Anyone willing to call `ServiceLoader.load(Iface.class)` can obtain an iterator over all known implementations of `Iface`. But it's usually the SPI party's responsibility.

Service provider ships a `META-INF/services/` directory containing plain text files whose
- file name is FQCN of a interface / abstract class, e.g. `java.sql.Driver`; and
- file content is multiple lines of FQCNs of the implementation this jar provides, one per line. e.g. `com.mysql.cj.jdbc.Driver`

Under the hood, `ServiceLoader` stats under each classpath entry for a `"META-INF/services/<SPI_name>"` file.