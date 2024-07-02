---
title: "WWW Fonts"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

- A typeface, a.k.a *font family*, is the unit of font design and distribution.

    A font family consists of a few fonts, each 
    
    regular version, a Bold version, an Italic version, and a Bold Italic version.

- A glyph is 

Helvetica" is a typeface, and "Helvetica Bold" is a font

Usually the font size is 

## `font-family` property

The CSS `font-family` property stipulates an ordered, comma-separated list of `<generic-name>` or `<family-name>` (other than [the single-keyword global values](https://developer.mozilla.org/en-US/docs/Web/CSS/all) applicable to all CSS properties).

For example:

```css
body {
    font-family: 'CassiaWeb-full', Georgia, serif;
}
```

where `'CassiaWeb-full'` and  `Georgia` are `<family-name>`, and `serif` is a `generic-name`.

A `<generic-name>` is one of the following:

```
serif
sans-serif
monospace
cursive
fantasy
system-ui
ui-serif
ui-sans-serif
ui-monospace
ui-rounded
emoji
math
fangsong
```

When the name of a `<family-name>` contains whitespace, it must be single- or double-quoted.

For each listed name, the browser tries to load the font glyph resources from
1. URLs given by CSS `@font-face` at-rule, as well as
2. the user's locally installed fonts.

Unfound names are ignored.

Font selection is done on a per-character basis.
For every character in an HTML element, the browser will try to locate its glyph in the first loaded `font-family`.
When the glyph is not found there, the next loaded font family is queried, and so forth.

A glyph mismatch can happen for many reasons. The font designer may choose to include only Latin characters, only CJK, or both, in the font family. For a paragraph where English and CJK characters are mixed, such a mechanism helps render both in the correct fonts.
