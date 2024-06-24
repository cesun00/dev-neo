---
title: "JDK Annotation infrastructure: runtime representation and types"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---


## AnnotatedElement

- RuntimeVisibleAnnotations
- RuntimeVisibleParameterAnnotations
- RuntimeVisibleTypeAnnotations

- directly present
- indirectly present
- present
- associated

JDK uses `interface AnnotatedElement (java.lang.reflect)` to represent any construct that can be annotated.
Well-known reflective representations of Java's construct like `java.lang.Class`, `java.lang.reflect.Method`, `java.lang.reflect.Field`, etc. all implements this interface.

Many primitive APIs are exposed by this interface, useful for creating your annotation parser. So let's first take a look into it:

*for definition of repeatable-respecting API, see [Repeatable Annotation Headache]({{<ref "repeatable-annotation-headache">}})*

```java
package java.lang.reflect;

interface AnnotatedElement {
    /**
     * Get the instance of an present annotation of given type. 
     * 
     * 1. inherited-respecting.
     * 2. non repeatable-respecting.
     * 1. 
     * 2. Return a single Annotation instead of an array. (was designed prior to repeatable annotation was introduced)
     * 
     * Returns:
     * 1. if a single `@A` is present, the unique `A` instance (regardless of whether `A` is `@Repeatable`)
     * 2. if none or more than one `@A` are present, `null`
     */ 
    <A extends Annotation> A getAnnotation(Class<A> annotationClass);

    /**
     * List all present annotations.
     * 
     * 1. respect @Inherited
     * 
     * In the returned array:
     * 1. if a single `@A` is present, the unique `A` instance is included (regardless of whether `A` is `@Repeatable`)
     * 2. if more than 1 `@A` is present, the container instance is included. None of `A` instance is included.
     */
    Annotation[] getAnnotations();


    /**
     * Repeatable-annotation-awared variant of getAnnotation()
     * 
     * Returns:
     * 1. if `A` is an annotation container
     *      a) if at least once A's containing annotation is present, a singleton array of `A`
     *      b) otherwise, `null`
     * 2. otherwise,
     *      a) if no `@A` is present, `null`
     *      b) if a single `@A` is present, a singleton array of the unique `A` instance (regardless of whether `A` is `@Repeatable`)
     *      c) if more than 1 `@A` is present, an array containing all instance of `A`
     */
    <A extends Annotation> A[] getAnnotationsByType(Class<A> annotationClass);


    /**
