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
```

## shortcode implementations lookup

<!-- Hugo by design supports selecting different templates by lang, outFormat, suffix. -->
<!-- Shortcode lookup use the same function as other template lookup, leading  -->

The [official document](https://gohugo.io/templates/shortcode-templates/#shortcode-template-lookup-order) claims
that for a given `{{}}` (or the percentage syntax) call, the following files are used as shortcode implementation

- `/layouts/shortcodes/<SHORTCODE>.html`
- `/themes/<THEME>/layouts/shortcodes/<SHORTCODE>.html`

But `.md` files in the same directory will also be picked up:

## Angle Bracket Call Vs. Percentage Mark Calls

The difference is poorly described.

`{{%/* bar */%}}`

1. A markdown file is first split with shortcodes (either syntax) as the delimeter.
2. For each split part, from top to bottom
    1. if it is a piece of markdown, go through the Goldmark renderer, and append the html result to output buffer
    2. if it is a shortcode call
        
        1. without inner content
