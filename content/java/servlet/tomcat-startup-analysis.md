---
title: "Tomcat Startup Analysis"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

// This is a quick guide for those who are interested in studying the source code of Tomcat.

The startup of a Tomcat instance is characterized by the instantiation of an `interface org.apache.catalina.Server` instance, whose only implementation is `org.apache.catalina.core.StandardServer`. In current practice this is done during 2 

1. When Tomcat started by being called as a library jar (so-called embedded Tomcat), the `Server` instance is created in `org.apache.catalina.startup.Tomcat#getServer`, where the the `StandardServer` constructor is simply called.
2. ``

https://commons.apache.org/proper/commons-digester/