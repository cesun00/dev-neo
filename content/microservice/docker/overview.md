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


```sh
# $ docker info
Client:
 Version:    26.1.3
 Context:    default
 Debug Mode: false

Server:
 Containers: 0
  Running: 0
  Paused: 0
  Stopped: 0
 Images: 0
 Server Version: 26.1.3
 Storage Driver: overlay2
  Backing Filesystem: extfs
  Supports d_type: true
  Using metacopy: true
  Native Overlay Diff: false
  userxattr: false
 Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 3a4de459a68952ffb703bbe7f2290861a75b6b67.m
 runc version: 
 init version: de40ad0
 Security Options:
  seccomp
   Profile: builtin
  cgroupns
 Kernel Version: 6.8.9-arch1-1
 Operating System: Arch Linux
 OSType: linux
 Architecture: x86_64
 CPUs: 32
 Total Memory: 62.7GiB
 Name: bite-into-reality
 ID: 9c945ae8-3982-4f10-9f78-36633c7ed914
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Experimental: false
 Insecure Registries:
  127.0.0.0/8
 Live Restore Enabled: false
```


### pull a image from docker hub



## Docker Compose

https://docs.docker.com/compose/

Docker Compose is another CLI client that communicates with the `dockerd`. Its executable is `docker-compose`.
It specifies properties of containers using a `docker-compose.yml` file rather than, typing `docker run` options all over the place.
This is useful for setting up reoccurring services that are frequently used and/or have complex configurations.

## Others 

## Docker Desktop

The official Docker site usually leads you to download a peripheral project known as *Docker Desktop*, which is a 
GUI program does image and containers management. Using the Docker Desktop application is not mandatory.
<!-- Docker Desktop itself needs to run on a virtual machine which uses KVM on Linux; this has nothing to do with docker .
You don't need it. -->