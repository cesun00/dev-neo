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


Because of this, the distribution was broken down into software sets.
Once called “disk sets” because they were designed for floppy-based installation
software series are now used primarily to categorize the packages included in Slackware.
As late as Slackware version 7.1 a partial install was possible using floppy disks
Today, floppy installation is no longer possible.

ISO images are available from since 12.0 (Jul 2007) for CD to burn.
Starting with the 14.1 release, Slackware ISO images (both the ones available online as well as the discs sent out from the Slackware store) have been processed using isohybrid

The CD set consists of 4 discs.
1. The first disk contains all the software needed for a basic server install, and the X window system.
2. The second cd is a “live” cd; that is, a bootable cd that installs into RAM and gives you a temporary installation to play around with or do a data or machine rescue. This cd also contains a few packages such as the KDE and GNOME desktop environments. A few other goodies are included on the second cd including many non-vital packages in the “extra” folder.
3. The third and fourth CDs contain the source code to all of Slackware, along with the original edition of the [SlackBook](http://www.slackbook.org/)

Each set contains a different group of programs. This allowed for someone to get the Slackware Linux distribution quickly. For example, if you know you don't want the X Window System, just skip all of the X software set.


| Series | Contents                                                                                                                |
|--------|-------------------------------------------------------------------------------------------------------------------------|
| A      | The base system. Contains enough software to get up and running and have a text editor and basic communication program. |
| AP     | Various applications that do not require the X Window System.                                                           |
| D      | Program development tools. Compilers, debuggers, interpreters, and man pages are all here.                              |
| E      | GNU Emacs.                                                                                                              |
| F      | FAQs, HOWTOs, and other miscellaneous documentation.                                                                    |
| GNOME  | The GNOME desktop environment.                                                                                          |
| K      | The source code for the Linux kernel.                                                                                   |
| KDE    | The KDE Desktop. The Qt library, which KDE requires, is also in this series.                                            |
| KDEI   | Internationalization packages for the KDE desktop.                                                                      |
| L      | Libraries. Dynamically linked libraries required by many other programs.                                                |
| N      | Networking programs. Daemons, mail programs, telnet, news readers, and so on.                                           |
