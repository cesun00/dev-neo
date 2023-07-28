---
title: "The AbstractQueuedSynchronizer"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- java
- multithreading
- JDK
---

The `AbstractQueuedSynchronizer`, aka. AQS plays an important role in Java multithread programming.
This article explains its technical details.

<!--more-->


```java
package java.util.concurrent.locks;

public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {
        
}
```

A thread is said to *own* an AQS instance if 

