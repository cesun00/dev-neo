---
title: "An overview to the Docker Ecosystem"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Docker is a container system that TODO.
An application that runs in a docker container is said to be containerized.

## Docker Engine

At the very core of Docker is the container that makes containerizing possible, branded as *Docker Engine*.
Docker Engine releases are commercial.
- The community edition, a.k.a *Docker CE*, is free

Docker Engine is a client-server software that consists of:
- the long-running `dockerd` daemon, which exposes HTTP APIs (claimed to be RESTful).

    The daemon creates and manages Docker objects, such as images, containers, networks, and volumes

- a `docker` CLI client program, which is simply a wrapper that calls the APIs.

Both programs are native binary executables.

### Running Docker Engine

The `dockerd` daemon listens on UNIX domain socket `/var/run/docker.sock` for incoming clients.
This socket file must be readable by the user who runs a docker client in order to establish the socket (to send HTTP request).

If you installed the Docker Engine from your Linux distro's package manager, this socket file may be only readable by the `root` or 
a special user group dedicated to Docker, e.g. `docker`.

You may choose to add yourself to that user group, or simply become `root` whenever using the `docker` client.

Use `docker info` to check if the `dockerd` is running and the client has permissions:


