---
title: "Spring IOC Construct Analysis"
ctime: 2023-09-02
mtime: 2023-09-02
tags:
    - spring
    - java
---


The `BeanFactory` interface hierarchy
===========

`BeanDefinitionRegistry` does bookkeeping of `BeanDefinition`s, while `BeanFactory` produce / cache real bean objects.
Though in current Spring they are always implemented by the same class - the `DefaultListableBeanFactory`,
i.e. both `BeanDefiniton`s and real beans are maintanied by the same object.

---

## `interface BeanFactory` (beans.factory)

The root `BeanFactory` defines only APIs for point query of beans; i.e. range query or listing of beans are impossible.

1. retrieve a unique bean (or their lazy provider) by its id or by class 
    - when querying by class, `NoUniqueBeanDefinitionException` is thrown if more than one satisfying beans are found
2. query bean characteristic ... by name
    1. existance
    2. class
    3. scope (singleton / prototype / other scoped)
    4. alias names

Any implementation of methods in this interface must respect its parent `BeanFactory`, if any.

`BeanFactory` has 3 important direct subinterfaces, which is discussed below.

1. `interface HierarchicalBeanFactory` (beans.factory)

