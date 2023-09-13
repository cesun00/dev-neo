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
