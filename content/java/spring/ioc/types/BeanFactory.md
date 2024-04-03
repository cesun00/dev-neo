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
            ConfigurableBeanFactory
```

⚠ SPRING'S INTERNAL USAGE ONLY.

`ConfigurableBeanFactory` itself adds very rich APIs, to programmatically adjust the configuration of an existing `BeanFactory`;
Such freedom of configuration are not meant to be available to application code, thus this interface is not included by the `ApplicationContext` hierarchy to prevent accidental upcast.

`ConfigurableListableBeanFactory | ConfigurableBeanFactory` is always implemented by `ApplicationContext`'s composite `AutowireCapableBeanFactory`, though.

| type            | subject                                                  | APIs                                              |
|-----------------|----------------------------------------------------------|---------------------------------------------------|
| singleton       | class loader for bean classes                            | get set                                           |
| singleton       | `ConversionService`                                      | get set                                           |
| singleton       | `BeanExpressionResolver`                                 | get set                                           |
| singleton       | `ApplicationStartup` for measuring startup metrics       | get set                                           |
| flag            | whether to cache bean metadata                           | get set                                           |
| collection-list | `StringValueResolver` for Java annotation value          | add has delegate-do (resolve)                     |
| collection-list | *!!* `BeanPostProcessor`                                 | add count                                         |
| collection-map  | (custom) scopes                                          | add list-key get-by-key                           |
| delegate read   | `AccessControlContext`                                   | get                                               |
| delegate do     | bean alias                                               | register do (resolve)                             |
| misc            | legacy `PropertyEditor` related objects                  | `PropertyEditorRegistrar` / `TypeConverter`, etc. |
| misc            | point test by id whether a bean is `CurrentlyInCreation` | get set                                           |
| misc            | point test by id whether a bean id is `FactoryBean`      |                                                   |

<!-- 
TODO

copyConfigurationFrom

getMergedBeanDefinition
isFactoryBean

registerDependentBean
getDependentBeans
getDependenciesForBean

destroyBean
destroyScopedBean
destroySingletons -->

A subinteface `ConfigurableListableBeanFactory` simply aggregates `ConfigurableBeanFactory`,  `ListableBeanFactory`, and `AutowireCapableBeanFactory`: 

```
BeanFactory             |                               
HierarchicalBeanFactory | SingletonBeanRegistry                 BeanFactory | BeanFactory
            ConfigurableBeanFactory                 |   ListableBeanFactory |    AutowireCapableBeanFactory
                                        ConfigurableListableBeanFactory
```

(thus all 3 direct subinterface of `BeanFactory`, wow.

`ConfigurableListableBeanFactory` as a subinterface of `ConfigurableBeanFactory`, of course is still for Spring's internal usage only.
However, it's easy for application to (arguably errorneously) obtain one by calling `ConfigurableApplicationContext#getBeanFactory`.

There are existing abuse of this interface already, e.g. adding new `BeanPostProcessor`, and people are celebrating their abuse anyway:
https://stackoverflow.com/questions/16448579/how-can-i-programatically-add-a-beanpostprocessor-to-a-classpathxmlapplicationco


Notable `BeanFactory` Implementations
=======================

## `class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry`


## `class AbstractBeanFactory` (beans.factory.support)
## `class AbstractAutowireCapableBeanFactory` (beans.factory.support)
## `class SimpleJndiBeanFactory` (jndi.support)
## `class StaticListableBeanFactory` (beans.factory.support)

## `class DefaultListableBeanFactory` (beans.factory.support)

The most used `BeanFactory` implementation of all time, because an instance is composited by all subclasses of `AbstractApplicationContext`, i.e. all implementation of `ApplicationContext`.




Auxillary Types
====================

## `interface BeanFactoryPostProcessor`

Simple one-method interface describing something to do after a `BeanFactory` is 

`BeanFactory` itself is not awared of `BeanFactoryPostProcessor`.
`ApplicationContext` manages all `BeanFactoryPostProcessor` instances, specifically:

```java
public abstract class AbstractApplicationContext {
    private final List<BeanFactoryPostProcessor> beanFactoryPostProcessors = new ArrayList<>();

    // ... 
}
```

`ApplicationContext` use this interface to do something after a BeanFactory finishs loading BeanDefinitions, but before any bean instance is created; mainly:
1. 

For `AbstractRefreshableApplicationContext` and subclasses, their `BeanFactory` is replaceable. Thus all `beanFactoryPostProcessors` may be run multiple times.