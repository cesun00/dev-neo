---
title: "Dockerfile Memorandum"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Instructions are still simple comparing to with only 17 instructions:

| name        |                                                             |
|-------------|-------------------------------------------------------------|
| ADD         | Add local or remote files and directories.                  |
| ARG         | Use build-time variables.                                   |
| CMD         | Specify default commands.                                   |
| COPY        | Copy files and directories.                                 |
| ENTRYPOINT  | Specify default executable.                                 |
| ENV         | Set environment variables.                                  |
| EXPOSE      | Describe which ports your application is listening on.      |
| FROM        | Create a new build stage from a base image.                 |
| HEALTHCHECK | Check a container's health on startup.                      |
| LABEL       | Add metadata to an image.                                   |
| MAINTAINER  | Specify the author of an image.                             |
| ONBUILD     | Specify instructions for when the image is used in a build. |
| RUN         | Execute build commands.                                     |
| SHELL       | Set the default shell of an image.                          |
| STOPSIGNAL  | Specify the system call signal for exiting a container.     |
| USER        | Set user and group ID.                                      |
| VOLUME      | Create volume mounts.                                       |
| WORKDIR     | Change working directory.                                   |

Only the instructions RUN, COPY, ADD create layers perpetuated in the resulting image.

Most instructions instruct how `docker image build` command should put a new layer the resulting static image, such that.
- An exception being the `RUN` command that execute an external command immediately at build-time.

It's very important to distinguish an instruction that gets executed instantaneously when `docker image build` is running,
and one that instructs how docker should behave after a container is instantiated from the created image.