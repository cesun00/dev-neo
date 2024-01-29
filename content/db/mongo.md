---
title: "MongoDB (misc)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## View

1. view is **read-only** aggregate of collections or other views.
2. view is not cached on disk; each query against a view is computed online everytime.
3. more fields can be added to a view based on the result of computation of old fields from collections/other views.
