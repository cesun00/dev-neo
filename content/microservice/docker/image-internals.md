---
title: "Docker Image Internals"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

An image is a read-only template with instructions for creating a Docker container.
Each image has an ID that uniquely identifies


Image is layered, layers of filesystems.
Each layer is a specification of how modifi

What that means is that an image is often based on another image.

To build your own image, you create a Dockerfile with a simple syntax for defining the steps needed to create the image and run it. 
**Each instruction in a Dockerfile creates a layer in the image.**
When the Dockerfile is modified and the image needs to be rebuilt, only those layers which have changed are rebuilt.


{{<card "info">}}

Docker doesn't store the Dockerfile in the built image.

An image can be built without a Dockerfile, e.g. 

For that reason,    

That's because you don't have to use a Dockerfile to create an image.
You can do literally anything and manifest the result into an image

making it cumbersome to inspect how an image is built.



{{</card>}}



 stratified.

```sh
# $ docker pull esolang/vim
Using default tag: latest
latest: Pulling from esolang/vim
4abcf2066143: Downloading  2.951MB/3.409MB
e7609a7fad9e: Download complete 
a891a2921638: Download complete 
6ea6322cdcb0: Download complete 
729f825b6ae6: Download complete 
e6cb43f5f474: Downloading  2.618MB/31.24MB
c12ed1c2e19b: Download complete 
