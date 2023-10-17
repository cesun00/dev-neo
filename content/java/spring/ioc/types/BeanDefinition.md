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
