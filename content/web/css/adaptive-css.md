---
title: "Path to Adaptive CSS"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
    - web
    - css
    - design
---

This article discusses common techniques for implementing webpages that are comfortably rendered on both PC and mobile devices.

## Prevent columns from getting too narrow

A common need is to keep your text in the horizontal center and occupies roughly 40% to 60% of the viewport.

Some Width-related media query can be equivalently achieved by a smart combination of `width/max-width` and `min-width`:


{{<columns>}}

```css {lineNos=inline}
main {
    max-width: 60%;
    margin: 160px auto;
    flex: 1;
}

@media (max-width: 600px) {
    main {
        max-width: 80%;
    }
}
```
<--->

```css
main {
    max-width: 60%;
    min-width: 480px;
    margin: 160px auto;
    flex: 1;
}
```

{{</columns>}}


```css
.foo {
    border: 2px green solid;
    width: 50%;
    margin: 0 auto;
    min-width: 900px;
}
```

## 