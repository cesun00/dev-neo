---
title: "Canvas Width and Height"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tag:
    - web
    - css
    - design
---


The `<canvas>` HTML element [has 2 standard attributes: `width` and `height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).
These attributes determine the coordinate system size of the `getContext('2d')` canvas context. In the absence of CSS `width` / `height` properties, they also determine the size of the content box.

Explicit CSS `width` and `height` will always take precedence when sizing the canvas block. The content image will be scaled to fit the box.

```html
<!-- render to a 400 x 800 block -->
<canvas height="400px" width="800px"></canvas>
```

The `<canvas height="" width="">` HTML attributes can be misleading when the canvas
is managed by a library that can resize the canvas coordinate system e.g. `threejs`. Such a resize will modify these 2 HTML attributes without affecting the CSS box size.