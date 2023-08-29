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

    ```java
    BeanFactory getParentBeanFactory();     // get the parent bean factory; `null` if there is none.
    boolean containsLocalBean(String name); // whether the local bean factory contains a bean
    ```

    Extends `BeanFactory` by allowing user to get a reference to its parent bean factory, and query if a bean is present locally.
    i.e the concept of having hierarchical bean factories starts here.

    Note that however, this interafce doesn't allow setting a parent bean factory.

2. `interface ListableBeanFactory` (beans.factory)

    Extend `BeanFactory` by providing APIs for range query and listing of beans, featured by returning collection or array:

    Application code is encouraged to this subinterface when range query of beans are needed, and `ApplicationContext`'s point query is not enough.

3. `interface AutowireCapableBeanFactory` (beans.factory.config)

    ⚠ NOT MEANT TO BE USED BY APPLICATION CODE. 

    Extends `BeanFactory` by allowing programmatically creation of new instances of a given bean class.

    It's mainly meant to be used by other frameworks that ... TODO,.
    thus the `ApplicationContext` aggregation doesn't include this interface, to prevent client from errorneously performing upcast.

## `interface ConfigurableBeanFactory` (beans.factory.config)

```
BeanFactory             |
HierarchicalBeanFactory | SingletonBeanRegistry
