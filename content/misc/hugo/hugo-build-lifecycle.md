---
title: "Hugo Site Building Internals"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
    - hugo
    - golang
---

For advanced theme customization, It helps to understand certain internals of Hugo.
This article looks into the Hugo source code and analyzes the site construction process, without putting too much demands on Golang familiarity.

<!--more-->

Hugo starts execution by traversing the filesystem tree and determining
individual HTML files that need to be built and eventually end up in the `public/` directory.
It starts in the `pagesCollector.Collect()` method by submitting to the worker pool a job running an `AddFi` (AddFile) method:

```go
//hugolib/pages_capture.go:85

// Collect collects content by walking the file system and storing
// it in the content tree.
// It may be restricted by filenames set on the collector (partial build).
func (c *pagesCollector) Collect() (collectErr error) {
    // ...
