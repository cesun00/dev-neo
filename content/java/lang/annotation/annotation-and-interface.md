---
title: "Annotation and Interface"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

There is no doubt that `annotation` and `interface`, as 2 important type-level constructs in Java, have a sheer amount of characteristics in common.

## Origin

Annotations were designed to replace the practice of *marker interface* and enhance its functionality.

A marker interface is simply an empty interface 

- by implementing which one can mark certain property of the implementing class.

Examples are `Serializable` and `Cloneable`, which still made their way into modern java.

Marker interfaces are problematic in the following sense:
1. They are invasive. Somehow your class must have a superinterface for business-irrelevant reason.
2. They breaks the boundary between library and langauges. Now the `javac` must check if an `Serializable` implementation has a static `serialVersionUID`, the same for `.clone()` and `Cloneable`,
    and JVM implementation must determine whether to throw an exception from the `.clone()` invocation by checking whether `this` class implements `Cloneable`.
3. They are abuses of the `interface` construct. Interfaces are meant to define contract APIs, and they don't.
4. They can't mark constructs other than classes. It's not a proper tool if you want to mark something special about a method.


Now you can mark way more construct other than class without mess with annoying superinterfaces.

## Syntax

Annotation is defined with the `@interface` syntax, and there is a reason.

Beyond their kindred origin, at langauge level each `interface @Foo {...}` behaves almost exactly the same as an `interface Foo extends java.lang.annotation.Annotation {}`:

1. You can check the subinterface relationship with reflection:
