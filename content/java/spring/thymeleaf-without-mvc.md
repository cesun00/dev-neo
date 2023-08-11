---
title: "Spring Boot: Use Thymeleaf without MVC"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Recently I was working on refactoring a purchase automation system that collects order data from various data sources, performs some pipeline computation and generates a human-readable daily report to our purchase specialists. The previous code generates an XLSX file where heterogeneous information is mixed into a single sheet ponderously and presented as rows whose non-empty columns differ. It's hard to read, and the code is hard to maintain.

Regular order statistics and various warnings are collected during the computation.
Generating an HTML file with clearly separated sections where each `<table>` can be customized is the preferred choice for me.
The resulting file will be uploaded to object storage and shared with our specialist as a downloadable HTTP link.

[Some HTML builder libraries](https://github.com/tipsy/j2html) first came into my mind, but soon I realized that the perfect tool is simply our good old friend - a template engine. In my case, Thymeleaf was chosen.

So this is the scenario we are facing: We are going to use a template engine in a standalone, non-web application, and instead of sending the result HTML back as the response to some HTTP request, we are going to write to a temporary file and then upload. This means the [normal setups of MVC](https://www.baeldung.com/thymeleaf-in-spring-mvc) will be a huge overkill.

Thymeleaf, as well as any template engine, is simply a piece of code that replaces input data (i.e. model) into predefined placeholders in templates and generates HTML string as output. There is no reason it must be used with MVC integration.

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
```

The package version is locked up by `org.springframework.boot:spring-boot-dependencies`.