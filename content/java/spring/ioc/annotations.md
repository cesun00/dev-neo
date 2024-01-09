---
title: "Annotation Handling"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The whole Spring ecosystem make extensive use of Java's annotation mechanism. This article will briefly discuss how annotations handled, and the spring framework.

Before start talking about Spring's infrastructure of annotation handling, you may want to hear my words on the design flaw of java's annotation, and why they sometimes brings trouble and can be slippery to beginners. [TODO: reference]

<!--

-->

Whoever wants to associate an `@Foo` instance with some `public class Bar {}` and make the presense of `@Foo` available from `Bar.class` reflection API 

---

native JDK should not support "transitivity" of annotation in any sense.


targetable construct (say a  definition) without directly tagging `@Foo` on that construct directly must implement such association with their own code. i.e. such indirect association should not be supported by `java.lang.reflect` in any form.

Oracle do the opposite, by making a few APIs in `Class<?>` respecting the `@Inherited` meta-annotation.
This causes chaos in.

 In an ideal world, you 

    Now I said "should not". Let's face the miserable reality: `@Inherited`. `@Inherited` is a notorious design failure. It should not ever existed in JDK.

1. dasd

## Representation of annotated stuff metadata

Spring has a weirdly named iface hierarchy for representing parsed information on class and method:

```yml
# common APIs for accesssing parsed annotation info on annotated *things* in java,
interface AnnotatedTypeMetadata (core.type)

    # adds API for accesssing parsed annotation on method - why not AnnotatedMethodMetadata??
    - interface MethodMetadata (core.type)             
        - class StandardMethodMetadata (core.type)
        - class SimpleMethodMetadata (core.type.classreading)
        - class MethodMetadataReadingVisitor (core.type.classreading)

    # adds API for accesssing parsed annotation on class - why not AnnotatedClassMetadata??
    - interface AnnotationMetadata (core.type)
        - class StandardAnnotationMetadata (core.type)
        - class SimpleAnnotationMetadata (core.type.classreading)
        - class AnnotationMetadataReadingVisitor (core.type.classreading)
```

![](./AnnotatedTypeMetadata.png)

## API & Parsing Details

You always parse the annotation info of a given class, and annotation info on a specific method of that class comes as a gift,
via the `AnnotationMetadata.getAnnotatedMethods()` method.

Since Spring 5, static method `static AnnotationMetadata introspect(Class<?> type)` becomes the recommended API to introspect
any class for its annotation info. It deprecates the old way of `new StandardAnnotationMetadata(clazz)` ctor.

`org.springframework.context.annotation.ConfigurationClassParser`

## Meta-annotation handling

Spring extensively use meta-annotation to create so-called annotation and composed annotation:
1. An `@Service`-annotated class should be treated as if it is `@Component`-annotated across the whole Spring ecosystem,
since `public @interface Service{...}` is meta-annotated by `@Component`.
2. An `@SpringBootConfiguration`-annotated class should be treated as if it is
 annotated by `@SpringBootConfiguration`, `@EnableAutoConfiguration` and `@ComponentScan`, 
 since `public @interface SpringBootConfiguration{}` is meta-annotated by these 3.

*Definitions*:
1. A class is *directly-annotated* 

It would be less confusing if the only annotation introspection supported by JDK is direct annotation, i.e.
if all APIs in `Class<T>` simply answer based whether annotations are directly tagged on `T` class.

If that was true, everyone who wants to benefits...

However, this programming model ("the annotation of my annotation is my annotation") is not natively supported by `java.lang.reflect`.
There is no existing API that respect such transition fo 

```java
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyMetaAnnotation { }

@MyMetaAnnotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Foo { }

@Foo
public class SomeService { }
```

What JDK indeed is that...

> "The annotation of my parent type is my annotation".

Personally I would consider `@Inherited` a design flaw.
Introducing more than 1 concept of other than direct-annotation into JDK tagging brings more confusion rather than convenience.



Let's call the following construct an `annotation-definition`:

```java
public @interface MyAnnotation /*Neither `extends` nor `implements` is allowed there.*/ {}
```

An `annotation-definition` essentially introduced an `interface` whose only superinterface is `java.lang.annotation.Annotation`.
No explicit parent is allowed.

## What `java.lang.reflect` provides

Meta-annotation is defined to be any annotation that can be tagged on an `annotation-definition`,
i.e. annotations whose `@Target` contains `ElementType.ANNOTATION_TYPE`.

This word is officially used by jdk's javadoc.

## sdjsdlfsjdksdlkfjsldfkjasdflkasjfdlkjsdafjsalkdfj

However, jdk assigns very little semantics to meta-annotation,
i.e. what it means if an `annotation-definition` is tagged with another annotation.
Without custom parser logics, an `@Foo public @interface Bar {}` is no different from `@Foo public class Zoo {}` - none of them cause code to execute.

Perhaps the only meaningful usage within JDK is the `@Inherited`:
Certain APIs on `Class<?>` instance (e.g. `getAnnotationsByType`, `isAnnotationPresent`)
will respect `@MyAnno` tagged on `public class Base{}` when introspecting `public class Derived extends Base{}`
and `@MyAnno` is not there. 
Remember you can always `getSuperclass()` and do the same manually. So these `@Inherited`-respecting APIs
are simply convenient helpers.

The fact that `@Inherited` being the only meta-annotation treated specially

## Spring's use of meta-annotation

Just because `public @interface Service` is annotated with `@Component` does not make `java.lang.reflect`'s API think
that  is also `@Component`-annotated.
At least there is no code in plain JDK that respect meta-annotation in this way.

It is now clear that Spring 

But 

 special. No API in JDK respected a `@Service`-annotated class in the same way it respect

JDK's reflection
treat  a candidate for component scanning.

Spring has a different interpretation of annotation compare to what `java.lang.reflect` natively provides:

*This mechanics is never a thing in raw JDK.*
So Spring must implement the meta-annotation interpretation itself.
[Unfortunately, Spring authors choose to also call this programming model *meta-annotation* in their document.](https://docs.spring.io/spring-framework/docs/5.3.24/reference/html/core.html#beans-meta-annotations)
We will be calling it the *spring-meta-annotation* from now to differentiate from jdk's meta-annotation.

Spring's definition of "what annotations are *tagged* onto a class" is represented by `interface MergedAnnotations`.
The idea is that `MergedAnnotations.from(clazz)` returns an `MergedAnnotations` instance 
which answers queries in a fashion consistent with Spring's meta-annotation ideology.

