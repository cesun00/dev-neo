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
    ├── data
    ├── hugo.toml
    ├── i18n
    ├── layouts
    │   ├── _default
    │   │   ├── baseof.html
    │   │   ├── home.html
    │   │   ├── list.html
    │   │   └── single.html
    │   └── partials
    │       ├── footer.html
    │       ├── head
    │       │   ├── css.html
    │       │   └── js.html
    │       ├── header.html
    │       ├── head.html
    │       ├── menu.html
    │       └── terms.html
    ├── LICENSE
    ├── README.md
    ├── static
    │   └── favicon.ico
    └── theme.toml
    ```

    {{</fold>}}

2. foio
3. bg



## site build process

A build of a Hugo site is initiated by a `hugo` invocation.
A top-level directory `public/` and sometimes also a `resources/` will be created after a successful build.
