---
title: "Docker Container Lifecycle & Managements"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

A container is a running instance of an image.

The lifecycle of a container starts from a `docker container create <image>` command, followed by a `docker start <container>`.

`docker run <image>` is a shortcut that does both, plus download the image from your configured registry (default: the docker hub) if `<image>` is not
presented locally. `docker run` always creates a brand new container from a given image and starts it.

To use an existing but inactive (exited or pause) container, use `docker start` again.

At any particular instant, a Docker container can be found in one of 6 possible states.
1. created: intact, the container has never been started since its creation.
2. running: 
3. Restarting
4. Exited(<num>): 
5. Paused
6. Dead

