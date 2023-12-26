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
        
        Now it is a shortcode call that either has no content

        

    
    its enclosed text are first inspected for nested shortcode
    
    
    its shortcode template is executed by receiving `.Inner` as the literal enclosed text (doesn't go through markdown renderer), 
        1. if it's an angle bracket call, the execution result (HTML) is appended to result to output buffer.
        2. if it's a percentage call, the execution result (HTML) goes through the Goldmark renderer, and then is appends the HTML result to output buffer.
3. the output buffer is dumped

You should be concerned with 

{{<columns>}}

#### Bracket calls

1. A markdown file is first split with shortcodes as the delimeter.
2. For each split part, from top to bottom
    1. if it is a piece of markdown, go through goldmark renderer, and append the html result to output buffer
    2. if it is a shortcode, its shortcode template is executed by receiving `.Inner` as the literal enclosed text (doesn't go through markdown renderer), and appends the HTML result to output buffer.
3. dump the output buffer for the final HTML files

<--->

#### percentalge calls

1. A markdown file is first split with shortcodes as the delimeter.

1. enclosed text go through markdown renderer
2. `YOURCODE.html` get executed by receiving `.Inner` as the rendered result html
3. the html becomes part of the markdown doc
4. the combined markdown doc go through the markdown renderer
    
    the fucking result is that
    1. the markdown contains some HTML already; the markdown renderer if configured to be unsafe=false, you will get `<!-- raw HTML omitted -->` in the final web page.
    2. indentation in `YOURCODE.html` is now considered code block section from the markdown renderer's perspective. GGGGEEEEEz
    
{{</columns>}}

## Escape for Literal shortcode syntax

`{{</* codedd */>}}`

## Correct design

shortcode should do only one thing: allow user to use HTML structure.




- `\{\{< YOURCODE >\}\}` get replaced first, then the whole markdown was send to the goldmark renderer
- `\{\{% YOURCODE %\}\}` render its `.Inner` markdown into html first, then fill the rendered html into the `YOURCODE.html` template

```
\\{\\{<wide>\}\}

##foo

\\{\\{</wide>\}\}
```
