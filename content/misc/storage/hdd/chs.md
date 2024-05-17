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
