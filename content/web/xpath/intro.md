---
title: "Introduction to Xpath"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

For most front / fullstack developers, the first tool coming into mind when you need locating a specific DOM `Element` (for further handling in javascript) is css selector. Selectors are great when you are the author of the DOM. Whichever nodes you want to select for styling, you can always pin `class` or even `id` on them, such that spelling a selector is simple enough - all because you can change the DOM at your will.

When you can't, however, selector is almost an disaster - this is the case for web crawler.
Imagine the following selecting demand (given no better `id` or `class`):

1. find the `<button>` containing text `"History"` (arbitrarily nested in subtree)
2. then find a `div` that is the siblings of the direct parent of that `<button>`, that contains a `<table>`
3. then in the subtree of that `table`, locate - among many `<tr>` - a row that contains text `"some product name"`
4. then in the subtree of that `<tr>`, click the `<a>` containing text `"foobar"`

Don't panic though - that's almost already the most complicated case in crawler code, and most times we haver better anchor point to use, but selecting needs like that do emerge frequently in development.

Let's first identify why selector can't be used. For CSS selectors:

1. selecting by `innerText` is simply impossible, not to mention arbitrarily nested text and `RegExp` based text matching.
2. selecting a node by its location w.r.t another node is almost impossible.

    If you think the DOM tree as a unix filesystem, what we want is the ability
    to `cd` by relative path w.r.t some current working directory, which CSS selectors doesn't provide.

    1. In simplest case, selecting a node by its descendent (i.e. parent selector - to select parents of known-to-be-selectable nodes) [is still poorly supported by browsers in 2023.](https://developer.mozilla.org/en-US/docs/Web/CSS/:has#browser_compatibility).
    2. complicated ones like select a node by its sibling's child is just impossible.
