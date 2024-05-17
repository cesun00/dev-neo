---
title: "Android: Execution Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## Dalvik

Android applications are written in the Dalvik language whose syntax and ecosystem are almost identical to Java, but it's not Java - it's Dalvik lang.

```
*.java
    |  javac
    v
*.class (canonical JVM bytecode)
    |  r8 or d8 (the java-bytecode to dalvik-bytecode translators)
    v
*.dex   (Dalvik EXecutables)
    |   zip all dex codes / native code / and resources together
    v
   foo.apk
   |    unzipped upon install, and optimized upon the first execution on host android device
   v
  *.odex (optimized DEX)
```

## Android Runtime (ART)

## Zygote

The pid 1 process of android. It's the first userspace process after linux kernel boots.

## Sandboxing

1. Each app run in its own user, i.e. unique UID and GID.
2. Supplementary groups can be attached to an app's user to grant filesystem previleges (read/write) to the app.
3. Supplementary groups can be attached to an app's user to grant operational previleges (e.g. open `AF_INET` i.e. TCP socket)
    TODO: how does this work with linux capabilities?
    e.g. `AID_INET_ADMIN` group grants the `CAP_NET_ADMIN`?


## User & Group