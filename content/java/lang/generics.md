---
title: "Genericity"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Overview
-----------

Java generics enable types (classes and interfaces) to be parameters when defining:
- classes,
- interfaces, and 
- methods.

Essentially, generics is a mechanism to ensure type-safety at **compile time**, so that programmers do not need to write downcast manually. `javac` compiler now generate surefire downcast, after checking types are compatible, or complain if not.

Syntaxes for **declaring type parameters**:

1. interface/class: type parameters between class/interface name and superclass/superinterfaces
2. method: type parameters between modifiers and return type

```java
interface I<T0,T1,...> extends ... {}
class Foo <T0,T1,...> extends ... implements ... {...}
/*static, abstract, ... */ <T0,T1,...> T0 foo(...) {...}
```
