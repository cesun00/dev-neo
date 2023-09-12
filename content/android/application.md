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

## App Components

4 types of app components:
- Activity
- Service
- Broadcast Receiver
- Content Provider

### Activity
*You implement an activity as a subclass of the `Activity` class.*

### Service

2 types of services:
1. Started Services: Started services tell the system to keep them running until their work is completed.
2. Bound Services: Bound services run because some other app (or the system) has said that it wants to make use of the service. This is basically the service providing an API to another process.

And Started Services can also be divided into 2 types:
1. Music playback is something the user is directly aware of, so the app tells the system this by saying it wants to be foreground with a notification to tell the user about it; in this case the system knows that it should try really hard to keep that service's process running, because the user will be unhappy if it goes away.
2. A regular background service is not something the user is directly aware as running, so the system has more freedom in managing its process. It may allow it to be killed (and then restarting the service sometime later) if it needs RAM for things that are of more immediate concern to the user.

A service is implemented as a subclass of Service. For more information about the Service class, see the Services developer guide.

*Use the `JobScheduler` class to schedule action after API level 21*
*Q: "action" and "service"?*

### Broadcast Receivers

A broadcast receiver is a component that enables the system to deliver events to the app outside of a regular user flow, allowing the app to respond to system-wide broadcast announcements.

Although broadcast receivers don't display a user interface, they may create a status bar notification to alert the user when a broadcast event occurs. More commonly, though, a broadcast receiver is just a gateway to other components and is intended to do a very minimal amount of work. For instance, it might schedule a `JobService` to perform some work based on the event with `JobScheduler`.

*A broadcast receiver is implemented as a subclass of `BroadcastReceiver` and each broadcast is delivered as an `Intent` object. For more information, see the `BroadcastReceiver` class.*

### Content Provider
*A content provider is implemented as a subclass of ContentProvider and must implement a standard set of APIs that enable other apps to perform transactions. For more information, see the Content Providers developer guide.*
*See also: Content Resolver*

## About Components

A unique aspect of the Android system design is that any app can start another app’s component. For example, if you want the user to capture a photo with the device camera, there's probably another app that does that and your app can use it instead of developing an activity to capture a photo yourself. You don't need to incorporate or even link to the code from the camera app. Instead, you can simply start the activity in the camera app that captures a photo. When complete, the photo is even returned to your app so you can use it. To the user, it seems as if the camera is actually a part of your app.
Android系统允许直接调用其他app的某个component（*在其他app允许的情况下？*），比如在你的app中直接调用camera app进行拍照，并返回拍得的图片。

When the system starts a component, it starts the process for that app if it's not already running and instantiates the classes needed for the component. For example, if your app starts the activity in the camera app that captures a photo, that activity runs in the process that belongs to the camera app, not in your app's process. Therefore, unlike apps on most other systems, Android apps don't have a single entry point (there's no main() function).

系统启动组件的时候，会为被调用的组件启动其所属app的进程。可以看到Android App可以有多个入口组件。
*<!--我认为-->这里的main() function的analogy并不恰当，Component和Java的main()不是同一个abstraction layer的概念，没有单一的入口Component不代表底层JVM不从main开始执行，因此容易造成歧义*

Because the system runs each app in a separate process with file permissions that restrict access to other apps, your app cannot directly activate a component from another app. However, the Android system can. To activate a component in another app, deliver a message to the system that specifies your intent to start a particular component. The system then activates the component for you.

出于系统安全性的考虑（独立进程，文件权限），app肯定不能直接激活别的app的组件。app通过Intent委托系统为其激活别的app的组件。

## Activating components

Activity, Service和Broadcast Receiver都由异步消息Intent启动。

Intent在运行时将两个组件绑定，是组件之间的信使。

一个Intent可以激活一个具体的组件(explicit intent)，或是仅声明需要激活的组件的类型(implicit intent)，由用户选择具体唤醒哪个组件（考虑有多个浏览图片的app时，打开图片会弹出系统对话要求选择具体的app）

当唤醒别的组件并期待一个返回结果时，返回结果也作为Intent对象返回。e.g. 要求用户选择一个联系人，则返回一个intent，包含一个指向用户所选的联系人的URI。

而ContentProvider由ContentResolver发起的资源请求唤醒。ContentResolver的存在将上层组件和ContentProvider解耦。 // for security?

不同组件的调用：
1. Activity: pass an Intent to startActivity() or startActivityForResult() (when you want the activity to return a result).
2. Service:
	if >= Android 5.0 (API Level 21), use `JobScheduler` class
	otherwise:
		start service: pass Intent to startService()
		bind service: pass Intent to bindService()
3. BroadcastReceiver: pass Intent to methods such as `sendBroadcast()`, `sendOrderedBroadcast()`, or `sendStickyBroadcast()`.
4. ContentProvider: call `query()` on a `ContentResolver`.

AndroidManifest.xml
-------------
0. Declare all the components of the app
1. Identifies any user permissions the app requires, such as Internet access or read-access to the user's contacts.
2. Declares the minimum API Level required by the app, based on which APIs the app uses.
3. Declares hardware and software features used or required by the app, such as a camera, bluetooth services, or a multitouch screen.
4. Declares API libraries the app needs to be linked against (other than the Android framework APIs), such as the Google Maps library.

Declaring Components
--------------
In `<application>`:
`<activity>` for activity
`<service>` for service
`<receiver>` for broadcast receiver
`<provider>` for content provider

activities, services, and content provider MUST be declared in the manifest file, otherwise they will never be run.

However, broadcast receiver can be either declared in the manifest or 
1. create in code at runtime as "BroadcastReceiver" object
2. register dynamically at runtime by calling "registerReceiver()"

Declaring component capabilities
------------
如Activating components中所说，Intent有2种：explicit intent & implicit intent
explicit intent指明了希望启动的组件的class name
而implicit intent仅指定了希望启动的组件的类型，告诉系统自己寻找合适的组件。如果有多个组件满足该类型，则可以由用户自行选择。

### implicit intent的安全性
使用intent启动service的时候，出于安全性的考虑尽量使用explicit intent
因为如果使用implicit intent，开发者无法得知运行时到底启动了哪个服务，且用户也无法看到启动了哪个服务
>=Android 5.0 (API Level 21)的版本，如果为`bindService()`传入一个implicit intent参数，则会抛出异常
*不要为service声明intent filter*

每个app的AndroidManifest.xml声明了该app的每个组件所能接受的intent
当你的app发起一个intent的时候，Android搜索系统中所有app的manifest，来找到可响应的组件

*Q: 对于implicit intent是寻找合适的组件；对于explicit intent是验证目标组件是否能响应发起的intent？*
*A: 只作用于implicit intent*

在manifest的组件tag中使用`<intent-filter>` tag来声明一个所能接受的intent
比如，下面是一个email app中用于编写邮件的activity的声明
```
<manifest ... >
    ...
    <application ... >
        <activity android:name="com.example.project.ComposeEmailActivity">
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <data android:type="*/*" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```
则如果某个别的app向`startActivity()`传递了`ACTION_SEND`类型的intent (implicit intent?)，系统就可能会启动该activity

Declaring app requirements - 声明app需求
--------------
Android可以运行在各种各样的设备上，这些设备并没有统一的软硬件规格

在manifest中声明app的软硬件需求。这种需求大多数是informational only的，Android系统不会理会，但是例如Google Play这样的外部服务会读取这些需求并根据用户软硬件配置做出过滤。
```
<manifest ... >
    <uses-feature android:name="android.hardware.camera.any"
                  android:required="true" />
    <uses-sdk android:minSdkVersion="7" android:targetSdkVersion="19" />
    ...
</manifest>
```
例如上面的例子中，app要求设备拥有相机，并声明自己使用了Android 2.1 (API Level 7)引入的API
这样，没有相机、或Android 2.1以下的设备就无法从Google Play安装该app

然而，可以声明该app使用了相机，但是并非required // `android:required="false"`
此时必须在运行时检查是否有相机，并根据结果决定是否打开/关闭特定的camera feature

App Resources
==================

Providing Resources
=================
https://developer.android.com/guide/topics/resources/providing-resources.html

"res/" folder用于存放资源
### default resource folders
1. animator/
2. anim/
3. color/
4. drawable/
5. mipmap/
6. layout/
7. menu/
8. raw/
9. values/
10. xml/
11. font/
*12. assets/* (?)

*Never store resource file directly in "res/" folder - it will cause a compiler error*

### Providing Alternative Resources
注意qualifier的命名规则
1. 多个qualifier用dash分隔
2. 多个qualifier必须按照网页中表2的顺序出现
3. resource subfolders不能嵌套
4. qualifier is case-insensitive
5. 同一个qualifier type只能有一个值
e.g. you cannot have a directory named drawable-rES-rFR/. Instead you need two resource directories, such as drawable-rES/ and drawable-rFR/

### resource alias
alias只能指向默认资源目录中的某个资源
比如希望drawable-en/中的icon指向drawable/中的icon.png
两种方式：
1. 在drawable-en/中创建icon.xml
2. 考虑到方法1需要为每个alias创建一个xml并不是很方便，可以将alias统一写在values/目录中的xml文件中
e.g. res/drawable-en/values/中创建drawables.xml，xml文件中用多个`<drawable>` tag声明alias

*values/中的文件会被统一读取，根据tag进行资源化，多个文件只是根据文件名进行语义区分（比如把字符串统一放在string.xml中）*

Accessing Resources
=============
### 代码中访问资源
1. `[<package_name>.]R.<resource_type>.<resource_name>`
指定了一个resource ID，该ID可以作为参数传递给很多方法
2. You can also retrieve individual resources using methods in Resources, which you can get an instance of with getResources().
方法1只是拿到了资源的ID，如果要获取资源本身，则使用Resources对象
You can get an instance of Resources with Context.getResources().

*You should never modify the "R.java" file by hand - it is generated by the "aapt" tool when your project is compiled. Any changes are overridden next time you compile.*

### XML中访问资源
`@[<package_name>:]<resource_type>/<resource_name>`

- `<package_name>` is the name of the package in which the resource is located (not required when referencing resources from the same package)
- `<resource_type>` is the R subclass for the resource type
- `<resource_name>` is either the resource filename without the extension or the `android:name` attribute value in the XML element (for simple values)

Activity
======================

intent filter - again
------------
```
<activity android:name=".ExampleActivity" android:icon="@drawable/app_icon">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```
*<category> and <data> are optional*

Invoke the activity above using implicit intent as follow:
```
// Create the text message with a string
Intent sendIntent = new Intent();
sendIntent.setAction(Intent.ACTION_SEND);
sendIntent.putExtra(Intent.EXTRA_TEXT, textMessage);
sendIntent.setType("text/plain");
// Start the activity
startActivity(sendIntent);
```

*如果希望一个activity不响应任何别的app发起的intent，则不写任何intent filter?*

Declare permissions - 声明权限
---------------
在一个activity调用另一个activity的关系中，calling activity和called activity必须满足权限关系
比如你的app要调用一个叫SocialApp的app中的某个activity（e.g. 分享一个post）：
### called activity (SocialApp):
```
<manifest>
<activity android:name="...."
   android:permission=”com.google.socialapp.permission.SHARE_POST”

/>
```

### calling activity (your app):
```
<manifest>
   <uses-permission android:name="com.google.socialapp.permission.SHARE_POST" />
</manifest>
```

*Q: 难道仅仅是字符串相同就能称为所谓的满足权限？*

Activity Lifecycle callbacks
=============
Activity在Lifecycle的不同stage之间进行transition，app可以通过6个核心callbacks来得知这些转变的发生

onCreate()
---------
You must implement this callback, which fires when the system first creates the activity.

TODO:
perform basic application startup logic that should happen only once for the entire life of the activity
e.g.
- bind data to lists
- initialize background threads
- instantiate some class-scope variables
- ...

`setContentView()` must be called here to define the UI
1. pass the layout xml file resource ID, or
2. Create `View`s in code, build a hierarchy by insert `View`s into ViewGroup. Pass the root ViewGroup to setContentView()

onStart()
--------------
The onStart() call makes the activity visible to the user, as the app prepares for the activity to enter the foreground and become interactive.

TODO e.g.
- initializes the code that maintains the UI
- might also register a BroadcastReceiver that monitors changes that are reflected in the UI

onResume()
---------------
If the activity returns to the Resumed state from the Paused state, the system once again calls onResume() method. For this reason, you should implement onResume() to initialize components that you release during onPause().

TODO:
- initialize components that you release during onPause()
- perform any other initializations that must occur each time the activity enters the Resumed state

e.g.
begin animations and initialize components that the activity only uses when it has user focus.

onPause()
--------------
The system calls this method as the first indication that the user is leaving your activity (though it does not always mean the activity is being destroyed).

Use the onPause() method to pause operations such animations and music playback that should not continue while the Activity is in the Paused state, and that you expect to resume shortly. 

**TODO**: You can use the onPause() method to release system resources, such as broadcast receivers, handles to sensors (like GPS), or any resources that may affect battery life while your activity is paused and the user does not need them.

**NOT TODO**: onPause() execution is very brief, and does not necessarily afford enough time to perform save operations. For this reason, you should not use onPause() to save application or user data, make network calls, or execute database transactions; such work may not complete before the method completes. Instead, you should perform heavy-load shutdown operations during onStop().

onStop()
-------------
Fired when your activity is no longer visible to the user.

In the onStop() method, the app should release almost all resources that aren't needed while the user is not using it.

*e.g. if you registered a BroadcastReceiver in onStart() to listen for changes that might affect your UI, you can unregister the broadcast receiver in onStop(), as the user can no longer see the UI.*

