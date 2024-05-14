---
title: "Flex and Grid Layout"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- css
- web
---


A flexbox, or a flex container, is an element used as a container,

## Mental Picture

2 directions needs to be identified for clarifying the flexbox mechanism:
- the main axis ;and
- the cross axis

Think an axis like an directional arrow.

Discussion of various layout and spacing methods will be based on clear identification of the 2 axes.

The `flex-direction` property of a flexbox determines the direction of the main axis and the cross axis. For English (and other left-to-right languages) this means:

| `flex-direction` | main axis     | cross axis |
|------------------|---------------|------------|
| `row` (default)  | left to right |            |
| `row-reverse`    |               |            |
| `column`         |               |            |
| `column-reverse` |               |            |

For each axis

### alignment container
