---
title: "Media Query For Adaptive Design"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tag:
    - css
    - web
    - design
    - media query
---

CSS media query allows a set of CSS rules to be conditionally applied only when the display device satisfies certain characteristics, including
- screen resolution or orientation
- aspect ratio
- browser viewport width or height
<!-- - user preferences such as preferring reduced motion, data usage, or transparency. -->



A media query looks like:

```css
@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}
```

Media query is standardized as
[Media Queries Level 4](https://drafts.csswg.org/mediaqueries/#media-descriptor-table)
and
[CSS Conditional Rules Module Level 3](https://drafts.csswg.org/css-conditional-3/#at-media).

## syntax
