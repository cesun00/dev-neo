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

    which implies
    1. multiple device pixels for printers and high-resolution screens, one CSS pixel

- `cm`: centimeters. Browser must be
- `mm`: 
- `Q`: 
- `in`: 
- `pc`: 
- `pt`: 

> Style sheets that use relative length units can more easily scale from one output environment to another.

Advance measure: the length of a character box in either horizontal or verticle direction, depending on the current writing direction.

e.g. For most monospace fonts, the advance measure of `0` is larger in top-to-bottom writing mode than in the left-to-right mode.

Relative units:
- `cap`: nominal height of capital letters
- `ch`: the advance measure of the glyph `0` of the element's font.
- `em`: `font-size` of the element resolved to 
    - note that using `em`-unit value for `font-size` itself is permitted, and 
- `ex`: x-height (i.e. height of the glyph `x`) of the element's font;
- `ic`: advance measure of the `水` (U+6C34, a CJK character) glyph.
- `lh`: 