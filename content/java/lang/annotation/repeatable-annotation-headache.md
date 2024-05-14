---
title: "Repeatable Annotations"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

Most annotations encountered from day to day are non-repeatable:
It's a syntax error if `@Component` or `@Configuration` is tagged twice on your Spring bean class.

Repeatable annotations are those which can be tagged more than once. To define a repeatable annotation, you must:
1. define annotation `MyRepeatable` itself with `@Repeatable(value = ...)` tagged, where the `value` field must be the `Class` instance of its so-called *container* annotation companion.
2. define the container annotation `MyRepeatableContainer`, whose value must be of type `MyRepeatable[]`.
3. ensure `@Target.value()` of `MyRepeatable` is a superset of that of `MyRepeatableContainer`.
4. ensure `MyRepeatableContainer` has a longer `@Retention.value` than `MyRepeatable`.

## Equivalence of Container and Multiple Occurrences

Given

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface FooContainer {
    Foo[] value();
}
```

And

{{<columns>}}
    
```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Foo {}

@FooContainer({@Foo, @Foo})
public class Service {}
```

