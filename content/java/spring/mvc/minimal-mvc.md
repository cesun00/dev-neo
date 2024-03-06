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
      <artifactId>spring-webmvc</artifactId>
      <version>5.3.30</version>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>4.0.1</version>
      <scope>provided</scope>
    </dependency>
  </dependencies>
```

Now we have a vanilla Servlet application set up. Our next goal is clear and simple:
1. install the classic Spring MVC entrance servlet, the `DispatcherServlet`;
2. create an `ApplicationContext` instance and ensure the registration of our `@Controller` beans

The `DispatcherServlet` should have a mapping that intercepts all incoming requests under its context path assigned at deployment time, and will dispatch control flow to the correct controller method depending on its `@RequestMapping` value.

```java
package com.example;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

/**
 * Tomcat will run Spring's implementation of javax.servlet.ServletContainerInitializer#onStartup,
 * which will in turn calls this method.
 */
public class MyWebApplicationInitializer implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(MyConfig.class);
        // no need to call refresh()
        DispatcherServlet s = new DispatcherServlet(context);
        ServletRegistration.Dynamic reg = servletContext.addServlet("app", s);
        reg.setLoadOnStartup(1);
        reg.addMapping("/");  // Be careful not to write `/*`
    }
}
```

Take care of the last line where mapping for `DispatchServlet` instance is added: writing `/*` will capture all requests, even those that end with `*.jsp`. This will break all your JSP/Thymeleaf workflow. See also [this section of Spring MVC doc](https://docs.spring.io/spring-framework/docs/5.3.24/reference/html/web.html#mvc-handlermapping-path) for the `addMapping()` myth.

We still need a simple `@Configuration` class that registers the controller bean, which can be done by either enabling `@ComponentScan` or explicitly writing JavaConfig methods; and a dummy controller:

```java
// MyConfig.java
package com.example;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
public class MyConfig {
}


// MyController.java
