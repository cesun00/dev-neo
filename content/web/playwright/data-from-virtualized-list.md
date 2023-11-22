---
title: "Data From Virtualized List"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Modern web design may choose to use virtual list or virtual table when displaying large amount of structured data.
The central idea is to increase page rendering performance by avoid creating each node for each data item.
Virtualized list keeps a few DOM nodes (most commonly `<li>`) only enough to fill its viewport, and change
the content of those DOM nodes by inspecting location of slide of the scrollbar when `scroll` event is fired.

In order to make the scrollbar display correct ratio despite the fact that there is only a few `<li>` nodes,
virtualized list usually takes the following DOM structure:

```html
    <div style="height: 200px; overflow: scroll;">
        <!-- a javascript computed height, to make the scrollbar ratio render correctly -->
        <div style="height: 20000;">
            <!-- but there are actually a few li enough to fill the 200px viewport -->
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </div>
    </div>
