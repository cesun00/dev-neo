---
title: "Disk Geometry and Cylinder-Head-Sector (CHS) Addressing"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## Geometry

Early hard drives didn't come with an embedded disk controller. The filesystem layer of an operating system must be aware of the physical geometry
of a hard drive. Commands issued from the OS explicitly use the CHS addressing.




<!-- Note that a disk sector identify a different region than the term sector in Geometrical  sense. -->
Also note the difference "block". block is commonly used by the Unix community ... .

An early hard drive contains 2, 4, or more platters. Both surfaces of each platter is divided into  ...
A sector is fixed 512 bytes, and each.
This would cause all tracks to have to same number of sectors, with 

See the following video to have a better understanding
TODO: video : https://en.wikipedia.org/wiki/File:HDD_Startup_and_Shutdown.webm


CHS imposed an around 8GiB limit for the capacity of 

The traditional limits were 512 bytes/sector × 63 sectors/track × 255 heads (tracks/cylinder) × 1024 cylinders, resulting in a limit of 8032.5 MiB for the total capacity of a disk.

<!-- Given 512 bytes/sector,
What this mean is that peripheral tracks would have more sectors. -->
 <!-- × 63 sectors/track × 255 heads (tracks/cylinder) × 1024 cylinders, resulting in a limit of 8032.5 MiB for the total capacity of a disk. -->

It would be a waste if all track has the same number of sectors, given peripheral tracks have more space.
 zone bit recording (ZBR) is a method used by disk drives to optimise the tracks for increased data capacity. It does this by placing more sectors per zone on outer tracks than on inner tracks

https://en.wikipedia.org/wiki/Zone_bit_recording


## Addressing

https://en.wikipedia.org/wiki/Dynamic_drive_overlay

Since the late 1980s, hard drives began shipping with an embedded disk controller that had good knowledge of the physical geometry; they would however report a false geometry to the computer, e.g., a larger number of heads than actually present, to gain more addressable space. These logical CHS values would be translated by the controller, thus CHS addressing no longer corresponded to any physical attributes of the drive


This applies to all commercial PCs before Windows 95B and MS-DOS 7.10 (both released in 1996)
introduced the logical block addressing (LGA).
<!-- in order to support disks larger than 8 GB/ -->

many tools for manipulating the master boot record (MBR) partition table still aligned partitions to cylinder boundaries; thus, artifacts of CHS addressing were still seen in partitioning software by the late 2000s.[2]


The CHS addressing captures the way a magnetic read head inside a hard drive would move.




- `cylinder` specifies a radius. This would select a (to be precise, hollow) cylindrical intersection through the stack of platters in a disk, centered around the disk's spindle.
- `head` selects one of the 2 surfaces of one of the platters.

    `cylinder` and head combined select a circular strip of physical data blocks called a track.

- `sector` finally selects which data block in this track is to be addressed.

in CHS addressing:
-  the sector numbers always start at 1
