---
title: "The CSS Box Model"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tag:
    - css
    - web
    - design
---

## Whether the border is in the box

For an HTML element whose size is computed or specified by the `height` and `width`, 

The `box-sizing` property determines whether the border is within or exterior to the height-width box. 

```css
box-sizing: border-box; /* border within */
box-sizing: content-box; /* border out */
```

Choice of `box-sizing` can be insignificant if the element has no border or very thin border (say 1px). But the difference becomes visible as soon as you are working with border thickness of 3px or more.

Setting `box-sizing: border-box;` can extrude the content and padding.
For example, for an `width * height = 100px * 50px` box with 3px border, the `border-box` sizing will render the `content+padding` in the center `94px * 44px`; while `content-box` will have the complete `100px * 50px` for `content+padding` and use protruding space for broder (i.e. the whole rendered item occupies `106px * 56px` except margin).

Also `box-sizing` is not inherited by default.
Using `box-sizing: border-box` for all elements on the page, a popular choice among developers, must be achieved by:

```css
html {
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: inherit;
}
```