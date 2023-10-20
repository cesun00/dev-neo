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

Chrome since 103 provides a `window.queryLocalFonts()` that returns a promise of an array of `FontData`, allowing JavaScript to query locally installed fonts at run time.

A `FontData` instance consists of:
- `family` (getter): the family of the font face.
- `fullName` (getter): the full name of the font face.
- `postscriptName` (getter): the PostScript name of the font face.
- `style` (getter): the style of the font face.
- `blob()`: return raw bytes of the underlying font file.

For example, `(await (queryLocalFonts())).filter(o=>o.family == "Noto Sans")` will give you all versions under the `Noto Sans` font family:


{{<fold "queryLocalFonts() result">}}

```json
[
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Black",
        "postscriptName": "NotoSans-Black",
        "style": "Black"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Black Italic",
        "postscriptName": "NotoSans-BlackItalic",
        "style": "Black Italic"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Bold",
        "postscriptName": "NotoSans-Bold",
        "style": "Bold"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Bold Italic",
        "postscriptName": "NotoSans-BoldItalic",
        "style": "Bold Italic"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Italic",
        "postscriptName": "NotoSans-Italic",
        "style": "Italic"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Light",
        "postscriptName": "NotoSans-Light",
        "style": "Light"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Light Italic",
        "postscriptName": "NotoSans-LightItalic",
        "style": "Light Italic"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Medium",
        "postscriptName": "NotoSans-Medium",
        "style": "Medium"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Medium Italic",
        "postscriptName": "NotoSans-MediumItalic",
        "style": "Medium Italic"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Regular",
        "postscriptName": "NotoSans-Regular",
        "style": "Regular"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Thin",
        "postscriptName": "NotoSans-Thin",
        "style": "Thin"
    },
    {
        "family": "Noto Sans",
        "fullName": "Noto Sans Thin Italic",
        "postscriptName": "NotoSans-ThinItalic",
        "style": "Thin Italic"
    }
]
```

{{</fold>}}

## Use web fonts

CSS author instructs the browser to download a specific font from Web for later use via the `@font-face` [CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule).

```css

@font-face {
  font-family: 'Lora';          /* declare the name of the font-family */
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lora/v35/0QIvMX1D_JOuMwr7Iw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```


Some font distribution site, e.g. google fonts, provides an dedicated CSS file.

For example

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
```


Depending on where those those `.woff2` font files are served from, 
- self-hosted
- font delivery service



## Web fonts and woff2 files


- TrueType Fonts (TTF)

    TrueType is a font standard developed in the late 1980s, by Apple and Microsoft. TrueType is the most common font format for both the Mac OS and Microsoft Windows operating systems.

- OpenType Fonts (OTF)

    OpenType is a format for scalable computer fonts. It was built on TrueType, and is a registered trademark of Microsoft.
    OpenType fonts are used commonly today on the major computer platforms.

- The Web Open Font Format (WOFF)

    WOFF is a font format for use in web pages. It was developed in 2009, and is now a W3C Recommendation. WOFF is essentially OpenType or TrueType with compression and additional metadata. The goal is to support font distribution from a server to a client over a network with bandwidth constraints.

- The Web Open Font Format (WOFF 2.0)

    TrueType/OpenType font that provides better compression than WOFF 1.0.

- SVG Fonts/Shapes

    SVG fonts allow SVG to be used as glyphs when displaying text. The SVG 1.1 specification defines a font module that allows the creation of fonts within an SVG document. You can also apply CSS to SVG documents, and the @font-face rule can be applied to text in SVG documents.

- Embedded OpenType Fonts (EOT)

    EOT fonts are a compact form of OpenType fonts designed by Microsoft for use as embedded fonts on web pages.

## Variable font

Variable fonts allow one font file to contain multiple variations.
You can change the weight, width, style, optical size, and more. The variables within variable fonts are controlled by axes.

https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts