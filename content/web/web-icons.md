## the bootstrap ages: custom glyph and `<i>` tag

```html
<div class="icon-preview col s6 m3">
    <!-- instead of showing `add_location` as english characters, the whole text is interpreted as a ligature glyph in the rendered fonts-->
    <i class="material-icons dp48">add_location</i>
</div>
```

https://icons.getbootstrap.com/
ℹi
pros: the color of icons can be adjusted via CSS `color` just like other text
cons: 
- icon can't have more than 1 color or detail component, the glyph pixels are just 1 and 0, if you set the `color` to white, the whole icon just disappears from a white background.
- users are limited to the set of glyphs provided by the font vendor. if the font vendor doesn't having the glyph you want, adding one is very hard

## unicode codepoint

instead of ty

## svg

## images