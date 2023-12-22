---
title: "GObject"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Misc

Gobject is single-inherited.

To register a custom type `Bar` in project `Foo`, usually you need to define a `struct FooBar` and a `struct FooBarClass`. 

- The prior is known as the instance struct, which contains fields that actually make up the size of each instance of your type.
- The later is known as the class structs, which holds "member functions", i.e. pointers-to-functions.

Custom types that follow the above conventions are said to be "classed" type, i.e. the `struct *Class` is there.

## mechanics

Like C++, fields of base type become part of the derived type,
and member function of base type is callable from derived type instance.

To achieve these,
- `struct FooBase` must be the first fields of `struct FooDerived`, and
- `struct FooBaseClass` must be the first member of `struct FooDerivedClass`.

Further, we hope that `FooBase.fieldA` can be referred as `FooDerived.fieldA`,
just like in native OO languages. This is achieved by forcefully casting a `FooDerived *`  to `FooBase *` (i.e. pointer reinterpret).
Now a `FooDerived` instance can be used as a `FooBase` instance safely, due to base being the first member.

`GObject` and `GObjectClass` are the base instance / class struct of all classed type. To 

## HOWTO
