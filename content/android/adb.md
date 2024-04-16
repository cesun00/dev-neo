---
title: "Android Debug Bridge (ADB)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---


The ADB suite consists of 
- on PC side, the `adb` server
- on PC side, the `adb` CLI client
- on the Android device, the `adbd` daemon.

Sometime the `adb` server on PC side is also called "daemon", for example when the first time `adb` is invoked from the command line after boot:

```
$ adb devices
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
78a1aee5	device

$ ss -lt
State      Recv-Q     Send-Q         Local Address:Port          Peer Address:Port    Process    
LISTEN     0          4096               127.0.0.1:5037               0.0.0.0:*              
```