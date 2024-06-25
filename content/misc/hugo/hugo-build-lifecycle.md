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

    c.g = rungroup.Run[hugofs.FileMetaInfo](c.ctx, rungroup.Config[hugofs.FileMetaInfo]{
        NumWorkers: numWorkers,
        Handle: func(ctx context.Context, fi hugofs.FileMetaInfo) error {
            numPages, numResources, err := c.m.AddFi(fi, c.buildConfig)
            // ..
    }
}
```

`fi` is Hugo's type for a filesystem file (a wrapper around a path string e.g. `$HOME/yoursite/content/posts/somepost.md`).

```go
func (m *pageMap) AddFi(fi hugofs.FileMetaInfo, buildConfig *BuildCfg) (pageCount uint64, resourceCount uint64, addErr error) {
    // ...

        // IsContent returns true if the path is a content file (e.g. mypost.md).
        // Note that this will also return true for content files in a bundle.
        if pi.IsContent() {
                // Create the page now as we need it at assembly time.
                // The other resources are created if needed.
                pageResource, pi, err := m.s.h.newPage(
                    &pageMeta{
                        f:        source.NewFileInfo(fim),
                        pathInfo: pi,
                        bundled:  true,
                    },
                )
                // ...
}
```

