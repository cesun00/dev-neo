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

At the end of the day, all type arguments are passed when invoking a function, either it's a instance method or static method or ctor; The syntax is: 

```java
// for ctor
new <FunctionScopeTypeParameter>Ctor<ClassScopeTypeParameter>(...);

// for methods
instance.<TA0,TA1,...>instanceMethod(...); // instance method
UtilClass.<TA0,TA1,...>staticMethod(...); // static method
```

i.e. you call a generic ctor of a generic class by:

```java
class A<T> {
    <E> A(E e) { System.out.println(e); }
}

A<Integer> a = new <Integer>A<Integer>(42);
```

See below for type deduction where you can free yourself from manually specifying type arguments.

Java generics is instance based: you can't have a generic class parameterized by `T`, and have a `static` field of type `T` (which you could in C++). A type parameter declared on a class and one declared on a ctor only differs in the scope.

```java
// can use T in non-static fields/methods across whole class, while E only in ctor
class C<T> {
    // static T t; // can't have this in java
    <E> C(T t, E e) { }
    T foo(){return null;}
}
```

