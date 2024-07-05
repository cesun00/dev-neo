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
