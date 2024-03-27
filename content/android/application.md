---
title: "Android Application Development Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- Android
---

## Application Fundamentals

https://developer.android.com/guide/components/fundamentals.html

The Android operating system is a multi-user Linux system in which each app is a different user.

By default, the system assigns each app a unique Linux user ID (the ID is used only by the system and is unknown to the app). The system sets permissions for all the files in an app so that only the user ID assigned to that app can access them.
每个app通常以独立且唯一的linux uid运行，app的文件设有权限，只有app的uid有权访问
<!-- *比如owner = APP_UID 然后射程700的权限？* -->

Each process has its own virtual machine (VM), so an app's code runs in isolation from other apps.
每个进程拥有自己的VM，独立于其他的app运行

By default, every app runs in its own Linux process. The Android system starts the process when any of the app's components need to be executed, and then shuts down the process when it's no longer needed or when the system must recover memory for other apps.
每个app在自己的linux进程中运行。Android系统在app的任意组件需要执行的时候都会启动其进程。在其完成工作或需要为别的app腾出内存的时候由Android结束进程。
<!-- *此处进程应该是指JVM进程？* -->

### The Principle of Least Privilege

The Android system implements the principle of least privilege. That is, each app, by default, has access only to the components that it requires to do its work and no more. This creates a very secure environment in which an app cannot access parts of the system for which it is not given permission.
每个app只有权访问其完成工作必须的最小部分组件，无权访问系统中未被授权的部分。

However, there are ways for an app to share data with other apps and for an app to access system services:
但是app之间仍可以通过以下方法实现数据共享：

1. It's possible to arrange for two apps to share the same Linux user ID, in which case they are able to access each other's files. To conserve system resources, apps with the same user ID can also arrange to run in the same Linux process and share the same VM. The apps must also be signed with the same certificate.  两个app可以共用一个linux uid，这样他们就可以访问彼此的文件。为了节约系统资源，共享uid的多个app也能被安排为运行在同一个linux进程中，并共享VM。这样的app也必须签有同样的证书。
2. An app can request permission to access device data such as the user's contacts, SMS messages, the mountable storage (SD card), camera, and Bluetooth. The user has to explicitly grant these permissions. For more information, see Working with System Permissions.  app可以请求权限，比如请求访问用户的联系人或者短信或别的外部设备（SD card，摄像头，蓝牙等）。用户必须明确地进行授权。
