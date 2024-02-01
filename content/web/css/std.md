---
title: "CSS Administrative Considerations: Modules and Levels"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tag:
    - web
    - css
    - design
---

<!-- https://www.w3.org/TR/CSS/#css-levels -->

## CSS Levels and Modules

The World Wide Web Consortium (W3C) was founded in 1994. The primary duty of the W3C is to develop technical specifications for HTML5, CSS, SVG, WOFF, the Semantic Web stack, XML, and other technologies.

The original plan for CSS in 1994 - 1995 was to create a feature-rich, but temporary typographical specification language that was good enough for up to 10 years. W3C hoped to observe the reception from the industry and use such an experience to devise the next-generation typography language.

However, the situation did not unfold as anticipated.
It turned out that browser vendors at that time were reluctant / unskilled enough to implement all the planned features. W3C had to compromise and make the specification a lot simpler for it even to be implemented.






The standardization of CSS took a level-based design from the very beginning.
The idea was to compile specifications incrementally, such that the CSS next-level specification would be built upon the CSS previous-level specification, adding features and making old definitions obsolete.
However, this idea of incremental documentation never becomes a practice.

This avoids republishing the whole document every few years,

Whether this operational pattern is worth it remains a question.
[The very first CSS specification](https://www.w3.org/TR/REC-CSS1-961217) was published by The W3C in 1996,
known as the *Cascading Style Sheets, level 1*.
It turned out that CSS level 2 changed so much from level 1 such that
level 2 became a complete rewrite. [The level 1 document is now considered completely obsolete.](https://www.w3.org/TR/CSS/#css-level-1)


Cascading Style Sheets does not have versions in the traditional sense; instead it has levels


## Significant Documents

### CSS Snapshots

CSS is moving forward fast. W3C has a document called the *CSS Snapshot* that captures the lastest state the  since 2007. A new version is released every 1 to 2 years.

The latest snapshot can always be found at https://www.w3.org/TR/CSS/.

### Current Works

https://www.w3.org/Style/CSS/current-work

shows the current status and a short description of all existing parts of CSS.

