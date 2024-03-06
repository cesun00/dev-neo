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

