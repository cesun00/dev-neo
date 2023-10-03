---
title: "Installing Slackware 12.0 in QEMU VM"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This is a walk through of intalling Slackware in QEMU, as well as an introduction to the legendary Slackware distribution.

## Slackware Sites

- http://www.slackware.com/

    The index page of all slackware resources.

    - https://docs.slackware.com/
    - A `ftp.slackware.com` host for ftp service. An HTTP listing is also supported.

- http://www.slackbook.org/

    The official guide book that comes with a Slackware installation.

- https://mirrors.slackware.com


See https://mirrors.slackware.com/mirrorlist/ for all known mirrors of .

Inside a slackware file tree:

```sh
slackware-pre-1.0-beta/	        # pre history files

slackware-<MAJOR>.<MINOR>/      # formal 32-bit releases
slackware/                      # symbol link to the latest `slackware-<MAJOR>.<MINOR>/`
slackware-current/              # symbol link to the latest `slackware-<MAJOR>.<MINOR>/`
