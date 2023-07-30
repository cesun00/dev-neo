---
title: "ApplicationContext Hierarchy Breakdown"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

`interface ApplicationContext` and subinterface `ConfigurableApplicationContext`
============

The interfacial hierarchy down since `ApplicationContext` is actually simple with only 1 subinterface `Configurable~`.

The idea of all `ApplicationContext`s is a proxy for `interface ListableBeanFactory` and `interface HierarchicalBeanFactory`:
an `ApplicationContext` implementation should hold a `BeanFactory` instance to which APIs inherited from these 2 super-interfaces are delegated.

(to be precise, the delegated `BeanFactory` must be subclass of `abstract class AbstractAutowireCapableBeanFactory` to 
support the `getAutowireCapableBeanFactory()` API, and almost always it's subclass `DefaultListableBeanFactory`)

----

## `interface ApplicationContext` (context)

```
# interfacial aggregation:

                BeanFactory                     |
ListableBeanFactory | HierarchicalBeanFactory   | EnvironmentCapable + MessageSource 
                                                |       + ApplicationEventPublisher + ResourcePatternResolver
                                        ApplicationContext
```


`ApplicationContext` combines `Listable~` and `Hierarchical~`, plus 4 misc interfaces:

1. `ApplicationEventPublisher`: an root interface that allows `publishEvent()`
