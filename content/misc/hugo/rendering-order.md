---
title: "Theme Internals"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article is a get-started guide for Hugo theme developers, but can also be useful
for Hugo users who want to understand the how-themes-work internals.

1. `hugo.yml` is parsed for the `theme` field, i.e. name of the directory in `themes/` which contains the active theme.

    {{<fold>}}

    ```
    .
    ├── archetypes
    │   └── default.md
    ├── assets
    │   ├── css
    │   │   └── main.css
    │   └── js
    │       └── main.js
    ├── content
    │   ├── _index.md
    │   └── posts
    │       ├── _index.md
    │       ├── post-1.md
    │       ├── post-2.md
    │       └── post-3
    │           ├── bryce-canyon.jpg
    │           └── index.md
