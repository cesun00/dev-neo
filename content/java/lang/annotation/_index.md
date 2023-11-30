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
    Code:
      stack=1, locals=1, args_size=1
         0: bipush        42
         2: invokestatic  #7                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         5: areturn
      LineNumberTable:
        line 7: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       6     0  this   Lcc/Main;
    RuntimeVisibleAnnotations:
      0: #23()
        cc.FG
    RuntimeVisibleTypeAnnotations:
      0: #23(): METHOD_RETURN
        cc.FG

```