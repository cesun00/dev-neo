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
