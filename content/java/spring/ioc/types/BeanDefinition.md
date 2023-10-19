---
title: "The `BeanDefinition` hierarchy"
date: 2024-01-01
lastmod: 2024-05-01
lastmod: 2024-07-01
draft: false
---

The IOC container manages beans. An `interface BeanDefinition` instance represents the metadata of a bean, and an `interface BeanDefinitionRegistry` represents a collection of `BeanDefinition`s.

There is only 1 `BeanDefinition` instance for each, well, bean definition, regardless of its scope being singleton / prototyped / custom-scoped.

## Misc helper interfaces & classes

- `interface BeanMetadataElement` represents a bean configuration source (e.g. ). TODO

    The most common subtypes are
    - `class BeanDefinitionHolder`: simple wrapper combining `BeanDefinition` and its name and aliases.

- `AttributeAccessor` is implemented by objects that support CRUD on its "attributes", i.e. `String` to arbitrary `Object` association.

## interfaces: `BeanDefinition` & `AnnotatedBeanDefinition`

`interface BeanDefinition extends AttributeAccessor, BeanMetadataElement` and allows configuring the metadata of (thus the nature of)
a bean by providing access to the following properties:

| property                                   | comment                                                                               | access      |
|--------------------------------------------|---------------------------------------------------------------------------------------|-------------|
| `String parentName`                        | `BeanDefinition`s can be hierarchical by design.                                      | get set     |
| `Object beanClass`                         | either `String` or `Class`, weird                                                     | get set     |
| `String scope`                             | scope name for scoped bean                                                            | get set     |
| `boolean lazyInit`                         |                                                                                       | get set     |
| `String[] dependsOn`                       |                                                                                       | get set     |
| `boolean autowireCandidate`                | whether this bean is a candidate for getting autowired into some other bean           | get set     |
| `boolean primary`                          | whether this bean is `@Primary` or `primary="true"`                                   | get set     |
| `String factoryBeanName`                   | `<bean factory-bean="" ...>`                                                          | get set     |
| `String factoryMethodName`                 | `<bean factory-method="" ...>`                                                        | get set     |
| `ConstructorArgumentValues`                | collection-like (\*)                                                                  | get isEmpty |
| `MutablePropertyValues propertyValues`     | collection-like (\*)                                                                  | get isEmpty |
| `String initMethodName`                    | `<bean init-method="...">`. DISRESPECT `@PostConstruct`                               | get set     |
| `String destroyMethodName`                 | `<bean destroy-method="...">`. DISRESPECT `@PreDestroy`                               | get set     |
| `int role`                                 | bean role enum int; one of: `ROLE_APPLICATION`, `ROLE_SUPPORT`, `ROLE_INFRASTRUCTURE` | get set     |
| `String description`                       | human-readable description for this bean                                              | get set     |
| `ResolvableType resolvableType`            | READONLY.                                                                             | get         |
| `boolean singleton`                        | READONLY.                                                                             | get         |
| `boolean prototype`                        | READONLY.                                                                             | get         |
| `boolean abstract`                         | READONLY. `<bean abstract="...">`                                                                             | get         |
| `String resourceDescription`               | READONLY.                                                                             | get         |
| `BeanDefinition originatingBeanDefinition` | READONLY.                                                                             | get         |

\* collection-like type property doesn't provide setter, since the getter-returned object itself provides CRUD on its internal collection.
Besides getter, there is usually an `isEmpty()` just for convenience, delegated to that collection-type.

## `interface AnnotatedBeanDefinition`

Extends `BeanDefinition` by being awared of the annotations on the bean class and 

adding for `AnnotationMetadata`, i.e. metadata about annotation on the bean class.

## `BeanDefinition` implementations


For the `BeanDefinition` implementations hierarchy, `class BeanMetadataAttributeAccessor` is often used as a base since it implementes both `AttributeAccessor` and `BeanMetadataElement`. The first implementation of `BeanDefinition` - `class AbstractBeanDefinition` inherits from that class.

## `abstract class AbstractBeanDefinition` 

A common base class for all non-trivial `BeanDefinition` implementation, containing shared logics,
e.g. fields for (so many) common properties required by the `BeanDefinition` interface.

3 direct subclasses:
- `class RootBeanDefinition` (beans.factory.support)

    Score

- `class ChildBeanDefinition` (beans.factory.support)

    

- `class GenericBeanDefinition` (beans.factory.support)



`interface BeanDefinitionRegistry` and implementations
=============

`AliasRegistry` defines simple CRUD APIs on an string to string mapping (think about a `Map<String, String>`) that 
- In current Spring 5 implementations, the mapping is always backed up by a real `Map` at `SimpleAliasRegistry#aliasMap`.

`interface BeanDefinitionRegistry` extends `AliasRegistry` by adding simple CRUD APIs on an id-to-`BeanDefinition` mapping
(1-to-1, think about `Map<String, BeanDefinition>`).
- In current Spring 5 production implementations, the mapping is always backed up by a real `Map` at `DefaultListableBeanFactory#beanDefinitionMap`.

## `SimpleAliasRegistry` (core)

## `DefaultSingletonBeanRegistry` (beans.factory.support)

## `FactoryBeanRegistrySupport` (beans.factory.support)

## `SimpleBeanDefinitionRegistry` (beans.factory.support)




`BeanDefinition` readers 
===========

Such classes serve the same purpose of populating `BeanDefinition`s in a `BeanDefinitionRegistry` instance.
Their patterns are:
1. hold an existing `BeanDefinitionRegistry registry` as its internal state
2. deriving `BeanDefinition`s from some source configuration in some format
3. add them to `registry` by calling `BeanDefinitionRegistry#registerBeanDefinition()`.

In current Spring, that `BeanDefinitionRegistry` is always an `ApplicationContext` instance, delegating to `DefaultListableBeanFactory#registerBeanDefinition`.

Such classes may or may not implement `interface BeanDefinitionReader`.
- those do: `abstract class AbstractBeanDefinitionReader` and subclasses
    - `XmlBeanDefinitionReader` (used by various `*XmlApplicationContext`s)
    - `GroovyBeanDefinitionReader`
    - `PropertiesBeanDefinitionReader` (deprecated)
- those don't:
    - `org.springframework.context.annotation.AnnotatedBeanDefinitionReader`
    - `org.springframework.context.annotation.ClassPathBeanDefinitionScanner`

## `class AnnotatedBeanDefinitionReader`

All public APIs delegate to the most critical method: 

```java
// Deriving a BeanDefinition from annotations on `beanClass`, and add it to `registry`.
private <T> void doRegisterBean(
    Class<T> beanClass,
    @Nullable String name,                                  // override default bean id generated by `AnnotationBeanNameGenerator`
    @Nullable Class<? extends Annotation>[] qualifiers,     // with qualifiers
    @Nullable Supplier<T> supplier,                         // override default way of creating an `T` instance by `new T(...)`
    @Nullable BeanDefinitionCustomizer[] customizers        // with callbacks allowing client to modify the `BeanDefinition` created
)
```

## `class ClassPathBeanDefinitionScanner`

This class extends root `class ClassPathScanningCandidateComponentProvider`, and 



## `BeanDefinitionCustomizer`
