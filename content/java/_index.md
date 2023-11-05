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

