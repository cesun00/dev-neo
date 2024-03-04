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
