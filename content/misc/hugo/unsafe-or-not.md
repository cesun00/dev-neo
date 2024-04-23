---
title: "Hugo: Allow Unsafe HTML or Not"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
    - hugo
---


Imagine the following need: a complicated `<table>` where a single cell can contain multiple paragraphs and highlighted codeblocks; cells are potentially merged (via `rowspan=` or `colspan=` attributes).