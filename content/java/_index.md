---
title: "Java"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

All about Java.

<!--more-->

| URL                                   |                                                                                        |
|---------------------------------------|----------------------------------------------------------------------------------------|
| https://www.oracle.com/java/          | Commercial Index page of Java.                                                         |
| https://www.java.com/en/              | Oracle proprietary JRE 8 download and resources. No JDK. Targeting non-technical user. |
| https://docs.oracle.com/en/java       | Oracle proprietary JDK SE/EE/ME documentations.                                        |
| https://blogs.oracle.com/javamagazine | Java Magazine - community articles collections about Java                              |
| https://jdk.java.net/                 | Oracle proprietary JDK, latest binary release.                                         |
| https://jcp.org                       | [Java Community Process](#jcp) index page                                              |
| https://dev.java/                     | Java developer community managed by Oracle.                                            |
| https://openjdk.org/                  | The OpenJDK project.                                                                   |



## Administrative Processes

### The Java Community Process (JCP) Program {#jcp}

The JCP program is the public process via which JSR documents are reviewed and promoted from a draft to a standard.
JCP represents the effort to turn Java from an Oracle-owned property to a community-driven & open-source programming language.

The program is hosted at: https://www.jcp.org/en/home/index.
Anyone can register for the site and participate in reviewing and providing feedback for the Java Specification Requests (JSRs).

### Java Specification Requests (JSR) {#jsr}

JSR is Java's equivalent to RFC. Each JSR is a proposal document written by one or more [JCP members](#jcp-member) and submitted to the [PMO](#pmo).
For an exhaustive of all JSRs, see https://jcp.org/en/jsr/all

As the same with RFC, each JSR is assigned an index number, consecutively incrementing from 1. Currently, it reaches 398.

JSR indexes greater than 900 are reserved for documents that ["were grandfathered-in to the JCP, having been initiated before the process existed"](https://jcp.org/aboutJava/communityprocess/ec-public/materials/2013-04-09/April-2013-public-minutes.html).


### JDK Enhancement Proposal (JEP) {#jep}

JEP is a different process internal to the OpenJDK developers and its community.
JEP allows the OpenJDK contributors to work on proposal drafts more informally, and only submit changes to JCP
and become formal Java standards when ideas become mature.
Diction in JEPs is usually be less informal. 

JEP's relationship with JCP is described in [JEP 1](https://openjdk.org/jeps/1) as follows:

> The JCP remains the governing body for all standard Java SE APIs and related interfaces. If a proposal accepted into this process intends to revise existing standard interfaces, or to define new ones, then a parallel effort to design, review, and approve those changes must be undertaken in the JCP, either as part of a Maintenance Review of an existing JSR or in the context of a new JSR.

## Authorities

### JCP Members

- Java Specification Participation Agreement (JSPA)

    Signing the JSPA grants Full Membership; Full Members can propose new JSRs, serve on Expert Groups, vote in the [Executive Committee](#ec) elections, and run for a seat on an Executive Committee.

- Associate Membership Agreement (AMA)

    Signing the AMA confers Associate Membership; Associate Members can serve as Contributors to a JSR and vote for the Associate seats on the Executive Committee. 

- Partner Membership Agreement (PMA)

    Signing the PMA grants Partner Membership; Partner Members can serve on the Executive Committee and vote for Ratified and Elected seats. 

An organization or individual that has signed any of the JSPA, AMA, or PMA has become a JCP Member.

### Expert Group & Specification Lead

An Expert Group is a group of JCP Members who collaborate on developing a Java Specification through a JSR.
Expert Group is assigned on a per-JSR basis. The members of an Expert Group are listed on each JSR's summary page.

A Specification Lead of a specific JSR is the leader (a person) of the expert group assigned to that JSR.

### Executive Committee (EC) {#ec}

The Executive Committee is the group of Members guiding the evolution of Java technology in the Java Community Process (JCP). The EC represents both major stakeholders and a representative cross-section of the Java Community. The EC is responsible for approving the passage of specifications through key points of the JCP and for reconciling discrepancies between specifications and their associated test suites.

### Program Management Office (PMO) {#pmo}
    
The PMO is the group within Oracle designated to oversee the Java Community Process and manage the daily running of the JCP program.

## MISC

#### classpath wildcard

For both the `CLASSPATH` env var and CLI flag for both javac and java, a special support for wildcard `*` exists,
s.t. `base/*` matches all `.jar` or `.JAR` under directory `base`.

#### Reflection and Security

`java.lang.SecurityManager`

https://docs.oracle.com/javase/tutorial/essential/environment/security.html
https://stackoverflow.com/questions/3002904/what-is-the-security-risk-of-object-reflection
https://stackoverflow.com/questions/1239581/why-is-it-allowed-to-access-java-private-fields-via-reflection

### Dual semantics of data member / field

There are 2 reasons why class A want to have a reference to an object of class B.
1. Encapsulatoin: B is some internal status of A, e.g. ArrayList internally keeps an `Object[]` as its content.
2. Dependency: A depends on some B object to complete its task. e.g. a Controller instance have an instance of `IService`, and it's not because `IService` instance is some "internal states" of a Controller.