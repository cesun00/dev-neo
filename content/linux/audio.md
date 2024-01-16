---
title: "Linux Audio Architecture"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

*Sound server* is the software  ...

## PulseAudio project

PulseAudio is a sound server implementation released by freedesktop.org, Lennart Poettering et.la. It was created in 2004 under the name `Polypaudio` but was renamed in 2006 to PulseAudio

`/usr/bin/pulseaudio` is a ELF binary.

Archlinux's release of pulseaudio contains the following systemd units shared by *systemd user instance* of all users: 

```sh
# pacman -Ql pulseaudio | grep systemd
pulseaudio /usr/lib/pulse-15.0/modules/module-systemd-login.so
pulseaudio /usr/lib/systemd/
pulseaudio /usr/lib/systemd/user/
pulseaudio /usr/lib/systemd/user/pulseaudio-x11.service
pulseaudio /usr/lib/systemd/user/pulseaudio.service
pulseaudio /usr/lib/systemd/user/pulseaudio.socket
```

## ALSA project

## misc

