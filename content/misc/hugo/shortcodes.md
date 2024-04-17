---
title: "Hugo Shortcodes Internals"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
    - hugo
    - go
---

Hugo is the second most-starred SSG framework according to [jamstack.org](https://jamstack.org/generators/).
It is the go-to SSG tool if you don't want to bother yourself with the whole ecosystem of ReactJS and NodeJS.
It surely surprises every user when so many things are missing from their documents.

The current (as of Jun 2024) design of shortcodes in Hugo is a mess, with too many surprises due to legacy code for backward compatibility.
The only 2 document pages explaining shortcodes are:

- https://gohugo.io/content-management/shortcodes/
- https://gohugo.io/templates/shortcode-templates/

This article explains various techniques unmentioned in the official documents.
Do be cautious, as 

<!--more-->

```go
// hugolib/page__content.go:44
const (
	internalSummaryDividerBase = "HUGOMORE42"
)

// hugolib/shortcode.go:185
// Note - this value must not contain any markup syntax
const shortcodePlaceholderPrefix = "HAHAHUGOSHORTCOD"
