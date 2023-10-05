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

An alignment container is computed for each flex item in a flexbox.


## Detail Control by CSS Properties

### Layout control

- `justify-*` controls the main axis
- `align-*` controls the cross axis
- `*-content` controls how free space is distributed among alignment containers along an axis.
- `*-self` (must be set on a flex item) controls where a flex item resides in its alignment container.
- Setting `*-items` on flex container is equivalent to setting `*-self` to the same value on each child flex item.


### Misc shorthands

| css property | shorthands for ...         |
|--------------|----------------------------|
| flex-flow    | flex-direction + flex-wrap |