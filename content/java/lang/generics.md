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

Type Deduction and Diamond
----------------

Invocation of generic method naturally enjoys type deduction:

```java
class B{
    <E> E foo(E e) {return null;}
    static <E> E bar(E e) {return null;}
}

B b = new B();
// static return type is ArrayList<Integer>
b.foo(new ArrayList<Integer>()).add(42);
B.bar(new ArrayList<Integer>()).add(42);
```

For generic method, the type of the left-hand side reference is also used to deduct type parameter which is used as (potentially part of) the return value. This is known as the "target type" inference:

```java
// given a free function:
static <T> List<T> emptyList();

// and later a invocation
// T is inferred as `String` in this call
List<String> listOne = Collections.emptyList(); 
```

Since Java 7, instantiation of generic class enjoys type deduction by using `<>` diamond when calling ctor:

```java
class A<T> {
    A(T t) {}
    T foo(){return null;}
}

new A(new ArrayList<Integer>()).foo();// static return type is Object
new A<>(new ArrayList<Integer>()).foo();// static return type is ArrayList<Integer>
```

**Note that the diamond can only be in `new ctor<>()` expression.**. For the left-hand side reference, you have to either
1. write whole type argument anyway, or
2. use java 9 `var`

```java
A<ArrayList<Integer>> x= new A<>(new ArrayList<Integer>());
x.foo(); // static return type is ArrayList<Integer>

A<ArrayList<Integer>> y= new A<>(new ArrayList<>()); // nested diamond!
y.foo(); // static return type is ArrayList<Integer>

var z = new A<>(new ArrayList<Integer>()); // java 9 var, no LHS info, so can't nest diamon
z.foo(); // static return type is ArrayList<Integer>

A<List<Integer>> u = new A<>(new ArrayList<Integer>());
u.foo(); // static return type is List<Integer>

A<Set<Integer>> v= new A<>(new ArrayList<Integer>()); // compilation fail: can't infer type arguments
```

Note:
1. how the reference can be declared using a supertype type parameter; this is **not** because `A<List<Integer>>` is a subtype of `A<ArrayList<Integer>>`, and has nothing to do with the liskov.
2. Diamond use both static type of left-hand side reference and type of arguments to ctor to infer. If they are not consistent, inference fails and compiler complains.

(Upper) Bounded Type Parameter
--------------

There is no lower-bounded type parameters. The `super` keyword can only appears as in type **arguments** in wildcards.

We can limit the upperbound on the inheritance hierarchy for type parameter, so that more abilities on the type parameter are exposed to us:

```java
interface I0 { int add(int a,int b); }
interface I1 { int sub(int a, int b);}
interface I2 { }

class A<E extends I0> {
    int foo(E e) {return e.add(1,2);}
}
class B<E extends I0 & I1 & I2> {
    int bar(E e) {return e.add(3,4);}
    int zoo(E e) {return e.sub(5,6);}
}

class X implements I0, I1, I2 {
    @Override public int add(int a, int b) { return 0; }
    @Override public int sub(int a, int b) { return 0; }
}

X x = new X();
A<X> a= new A<>();
B<X> b = new B<>();
a.foo(x);
b.bar(x);
b.zoo(x);
```

Note the `&` syntax to specify multiple bounds. When one of those bounds is a class, it must be the first in the `&`-ed types:

```java
class B<E extends T & I0 & I1 & I2> { ... } // assuming T is a class type
```

Wildcard
------------

The wildcard character `?` is useful when you want your type A to be parameterized by some other type B but you don't really care about what B is, thus we don't capture B using a named type paramteter nor refer to it.

Wildcard is usually used as a **type argument for reference declaration**, but **never** as a type argument for a generic method invocation, a generic class instance creation, or a supertype.

```java
// if capturing T is not really interesting ...
static <T> void zoo(List<T> myList) { for (T o : myList) System.out.println(o); }
// we can use wildcard to take a List of anything
static void foo(List<?> myList) { for (Object o : myList) System.out.println(o); }
// compilation error when taking a List<Integer>
static void bar(List<Object> myList) { for (Object o : myList) System.out.println(o); }
```

### upperbound wilcard

```java
// we know myList is at least a list of Number
static double sum(List<? extends Number> myList) {
    double ans = 0;
    for (Number a : myList)
        ans += a.doubleValue();
    return ans;
}
```

### lowerbound wildcard

TODO

#### Interesting Observation for wildcard containers

`List<? extends Number>` is readonly, while `List<? super Integer>` is write-only.

### Instantiate Parameter Type

One can't create an instance by simply `new` a parameter type, since at the time of compilation, compiler has no idea about the type argument will be passed in in the future and the signature of ctors.

The only way to do so is via reflection at runtime.
Type Erasure
---------

Type erasure refers to the fact that all information about type parameters are erased during runtime.

Downcast JVM instructions are generated by the compiler after checking type-safety, and JVM at runtime only sees unparameterized class instances / method calls.

This is due to the fact that generics were introduced in JDK 5. Prior version works without type parameter, and perform downcast manually, which kinda like you downcast a `void *` in C. Of course that's not safe in the sense that JVM throws `ClassCastException` when you cast to the wrong thing.

JLS also use the word "erasure" to refers to
1. the mapping between the generic types written in source code and the real type that JVM sees at runtime.

	e.g. we say "`ArrayList` is the erasure of `ArrayList<Integer>`".

2. the mapping between the signature of a method or ctor to its runtime version by applying (1) to each of its parameter.

	e.g. "`List foo(ArrayList a)` is the erasure of `List<Character> foo(ArrayList<Integer)`".
