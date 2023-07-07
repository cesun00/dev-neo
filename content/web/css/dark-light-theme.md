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
