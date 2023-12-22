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
