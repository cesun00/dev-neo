---
title: "Master Boot Record (MBR)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## MBR Format

The MBR consists of 512 or more bytes located in the first sector of the drive.

MBR supports up to 4 primary partition.
One (and only 1) of the primary partitions can be selected as a special ones known as an extended partition, 
that partition can be subdivided into a number of logical partitions.

TODO: can there be multiple EBR / extended partition?
each EBR precedes the logical partition it describes
EBR resides in the first sector in the extended partition.

An unused partition entry must be filled with 0.

https://www.win.tue.nl/~aeb/partitions/partition_types-1.html


## volume boot records (VBR)

## Bootstrapping Code

