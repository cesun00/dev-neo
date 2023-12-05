---
title: "CSS MISC"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tag:
    - web
    - css
    - design
---

- The specified value:
- The computed value:
    Inheritance of CSS property value is based on computed value.
- used vlaue

e.g. a `width: 80%;` CSS declaration, for a given element whose parent has an computed value of `1000px`, has
- a specified value of `80%`
- a computed value of `800px`
- 

## Lenght spec

- The specified value of a length (a.k.a specified length) is represented by its quantity and unit.
- The computed value of a length (a.k.a computed length) is the specified length resolved to an absolute length, and its unit is not distinguished.

> Child elements do not inherit the relative values as specified for their parent; they inherit the computed values.

Absolute length
- `px`: a CSS pixels

    > The reference pixel is the visual angle of one pixel on a device with a pixel density of 96 DPI and a distance from the reader of an arm’s length.
