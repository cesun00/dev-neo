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
| T      | teTeX document formatting system.                                                                                       |
| TCL    | The Tool Command Language. Tk, TclX, and TkDesk.                                                                        |
| X      | The base X Window System.                                                                                               |
| XAP    | X Applications that are not part of a major desktop environment (for example, Ghostscript and Netscape).                |
| Y      | BSD Console games                                                                                                       |


Versions from 4.0 to 7.0 (exclusivly) doesn't exist.
There was a bump from v4 to v7 for marketing purposes.
http://www.slackware.com/faq/do_faq.php?faq=general#0
Poor software people just get anxiety from everything related to money.

## Installation

ISO images before Slackware v14.1 cannot boot via UEFI.

An ELILO installtion will be prompted during the setup only if the CDROM image is boot from UEFI.

For QEMU this is achieved by:

tar.xz compression was used to achieve a high ratio:

```
Total size of all packages (compressed):  3760 MB
Total size of all packages (uncompressed):  17375 MB
```

```sh
mkdir slack && cd slack
wget 'https://mirrors.slackware.com/slackware/slackware-iso/slackware64-15.0-iso/slackware64-15.0-install-dvd.iso'
qemu-img create -f raw slackdisk.raw 20G        # slackware 15 needs more than 17 GiB
qemu-system-x86_64 -m size=4G -cdrom ../slackware64-15.0-install-dvd.iso -boot order=d -drive file=./slackdis.raw,format=raw -drive ip=fpslash
```

Skip kernel flags
Skip keyboard
login as root
```sh
# check disk
lsblk
#
gdisk /dev/sda
o
n   # EFI sys: ef00
n   # Linux: 8300
w

setup
    TARGET
        you don't need specify the EFI system part; will be auto detect
    INSTALL FROM CD; auto SCAN /dev/sr0

    REMOVE everything related to X, including `L` system libraries.

        The division of software set is not makign sense TODO
        for example, libsodium.so is required by vim (see ldd `which vim`). 
        vim is in the `ap` set while libsodium is in the `l` set.
        Deselcting the `L` set ... if needed by other software
    
    INSTALL
        full: install all softwares in set you selected in the previous SELECT screen, with a cursee dialog shortly appears for each package
        terse: for each package print one line of its title, short description and size
        menu: a checkbox list screen for each software set to pick or unpick individual software ; then install
        newbie: like full, but stop for non-mandatory software, and show a few options asking the user to install or not.

        expert:     TODO
        tagpath:    TODO
```

During the installation it's useful to switch to a second console by `ALT+F2` and check the disk usage by `df -hT` (usually by checking `/dev/sda?`).

## CD ROM PATH TRICK
