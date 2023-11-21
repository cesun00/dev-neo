---
title: "Minimal Spring MVC Application"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This is a quick example of how to start a minimalistic Java Web application with Spring MVC.
We will stick to the vanilla workflow of Jakarta EE as possible, and just demonstrate how Spring MVC gets into the picture, without introducing unnecessary complexity from redundant Spring components.
This example can also serve as a good starting point for studying the underlying mechanics of Spring MVC or Spring framework.

As with classic JEE applications, you'll need to build the project as a `war` file and deploy
it to Tomcat or a servlet container of your choice. Thanks to the `javax.servlet.ServletContainerInitializer` SPI since Servlet 3.0, We don't need XML-based registration of `ApplicationContext` and `DispatcherServlet` anymore.

> Among other usage, SPI allows library to receive self-initialization callbacks. If you are interested in how it works, I have [a nice article for you]({{<ref "../../lang/spi.md">}}), go check it out!

Maven is not necessary if you decide to package a conforming `war` file on your own,
but it's nice to know there is a production-ready archetype you can always use:

```sh
mvn archetype:generate -DinteractiveMode=false \
    -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-webapp -DarchetypeVersion=1.4 \
    -DgroupId=org.example -DartifactId=simple-mvc -Dversion=1.0-SNAPSHOT 
```

Edit the `pom.xml` file.
As mentioned above, this is a minimal Spring MVC project, and we will only have a direct dependency on `spring-webmvc`.

```xml
<!-- you may also want to change the language level -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
  </properties>

<!-- ... -->
  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
