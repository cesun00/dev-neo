---
title: "Java Annotation"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

The annotation construct that facilitates all sorts of magic in Java.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE_USE, ElementType.METHOD})
public @interface Foo {
}

@Foo
Integer getMenaing() {
return 42;
}
```


```
 java.lang.Integer getMenaing();
    descriptor: ()Ljava/lang/Integer;
    flags: (0x0000)
