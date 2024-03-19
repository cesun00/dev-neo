---
title: "HTML5 Tags Cheetsheet"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tag:
    - web
    - html
---

HTML tags synopsis and gotcha.

<!--more-->

## `<link>`: referencing external resources

The `<link>` tag is designed to reference external resources by its URL.

That being said, the definition of external resources can be vague (see, at least JavaScript files as external resources are not loaded via this tag).

The most important attributes of this tag are `rel` and `href`:
- `rel`: relationship of the linked document to the current document.

    However, the semantics of `rel` is heavily overloaded.
    Some allowed enums of this attributes can hardly be described as a "relationship" to the current document.

    Its value must be a space-separated list of allowed Link Relations values, whose authoritative registry is [maintained by IANA here](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

    - `stylesheet`
    - `preconnect`: tell the browser to initiate a TCP connection as long as this `<link>` is seen, to accelerate the speed of page loading:

        This technique is frequently used for webfont loading optimization:

        ```html
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
        ```


- `href`: 

Also, some `rel` values allow an `<link>` tag to provide metadata about the page, like author and gg

Some other attributes:


## `<meta>`

## `<noscript>`

Content wrapped by the `<noscript>` tag is treated as non-existent when JavaScript is disabled or unsupported;

## `<p>`

`p` tag cannot be nested. Nesting them will cause the browser to extract the inner `p` out and list them as siblings. This can lead to styling failure:

```html
<p style="color: rgb(230 230 230);">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus itaque suscipit quisquam est aliquid consequatur
    reprehenderit a voluptates corrupti ex et, eligendi libero numquam, magnam eum veniam quis, facilis labore.
    <p>
        <!-- grey text color doesn't applies -->
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium ipsa ipsam explicabo commodi voluptatibus
        in qui dicta iure nostrum, eligendi earum hic nesciunt. Nobis iure ex placeat veniam aperiam repellat!
    </p>
</p>
```
