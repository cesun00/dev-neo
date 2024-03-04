---
title: "The Notorious Static Initialization"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---


The following program on zulu 11 never prints `GET 42`!

```java
interface Foo {
    int value = App.get42();
    int foo();
}

class Bar implements Foo {
    @Override
    public int foo() {
        return 0;
    }
}


public class App {
    static int get42() {
        System.out.println("GET 42");
        return 42;
    }
    public static void main(String[] args) {
        Foo c = new Bar();
        c.foo();
    }
}
```