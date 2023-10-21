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

slackware64-<MAJOR>.<MINOR>/	64-bit x86 are supported since v13.0
slackware64/	                # symbol link to the latest `slackware64-<MAJOR>.<MINOR>/`
slackware64-current/            # symbol link to the latest `slackware64-<MAJOR>.<MINOR>/`

slackware-iso/      # ISO format releases since v12
	slackware-MAJOR.MINOR-iso/
        slackware-MAJOR.MINOR-install-d[1234].iso   # foo
        slackware-MAJOR.MINOR-source-d[56].iso    # foo
        slackware-MAJOR.MINOR-install-dvd.iso  # foo
        slackware-MAJOR.MINOR-source-dvd.iso   # foo
        # omitted checksum files 
	slackware64-MAJOR.MINOR-iso/

unsupported/        # use at your own cautious
                    # Custom boot disks, packages, software add-ons, and other such enhancements
                    # that we want to make available, but that we don't want to support.  :)
```


## Obtain Bootables

Slackware Linux was first released before CD-ROMs became a standard in systems and before fast Internet connections were cheap.
At the beginning of time, network access to FTP servers was available only through incredibly slow 300 baud modems, so Slackware was split into disk sets that would fit onto floppy disks so users could download and install only those packages they were interested in. Today that practice continues and the installer allows you to chose which sets to install. This allows you to easily skip packages you may not want, such as X and KDE on headless servers or Emacs on everything. Please note that the “A” series is always required.


