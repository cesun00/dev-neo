---
title: "Dark / Light Theme Switching"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tag:
    - web
    - css
    - design
---

Implementing a website that supports light / dark theme switching is as simple as adding a `dark` class to the `body` element
at the user's request (e.g. event listener on a button click), and styles elements accordingly:

```js
document.body.classList.add('dark');
```

The problem with 


[Mainstream browsers support CSS variables (i.e. custom properties) since 2016](https://developer.mozilla.org/en-US/docs/Web/CSS/--*#browser_compatibility), making 

<!--more-->

The basic idea is to have a set of light colors defined globally:

```css
:root {
    
}
```

and change their value to dark color when dark mode is on.
Such change can be done by specifying a more detail selector thus override the general CSS rules, or change their value via javascript directly ([yes, this is possible](https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js)):

```css
.dark {

}
```

Toggling of light / dark theme is done at user's request, usually a by clicking an toggle button. 2 things must happen in the event handler:

1. the `dark` class is added to `<html>` by JavaScript, 
2. a variable need to be persisted to the `LocalStorage`, 

The basic idea is to save a variable in the browser `LocalStorage` and use a different set of color CSS variables upon opening a page or when the state change.
The 

## Detecting User's Preference

The main

Since 2018, CSS has builtin support for color schemes, which beceoms the de-facto standard way of implementing dark / light themes.

The support works as follows: a new media query

opted into

### `prefers-color-scheme` media feature

The browser provides each page with a color theme information of either `light` or `dark`.
Its up to the browser vendor how 

When a page is loaded, only those media query with correct

```css
@media (prefers-color-scheme: light) {
    /* all rules here applies only if  */
}
@media (prefers-color-scheme: dark) {

