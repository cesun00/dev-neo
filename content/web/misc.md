## JavaScript Size Query API

- window.innerHeight / window.innerWidth

    the height / width of the content area of the browser window including, if rendered, the horizontal scrollbar.

- window.outerHeight / window.outerWidth

    the height / width of the outside of the browser window.

- window.screen.height / window.screen.width

    Returns the height width of the screen.

- window.screen.availHeight / window.screen.availWidth

    The height / width in CSS pixels of the space available for Web content on the screen.

    (i.e. subtracting OS features like task bar or dock)

- `<DOM element>.clientWidth` / `<DOM element>.clientHeight` is
    1. the viewport width / height (excluding any scrollbar) if on `<html>`; or if on `<body>` plus browser in quirks mode; quirks mode documents almost extinct.
    2. 0 for `display:inline` elements
    3. the height / width of `padding + content - scrollbar (if any)`

    This property will round the value to an integer. If you need a fractional value, use `element.getBoundingClientRect()`.

    https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode


- `<DOM element>.scrollHeight` / `<DOM element>.scrollWidth` for any DOM element is a the height TODO;

- `<DOM element>.offsetHeight` / `<DOM element>.offsetWidth`
    
For a maximized chrome on 2K screen:

```js
console.log(window.innerHeight) // 1082
console.log(window.innerWidth) // 1044
console.log(window.outerHeight) // 1440
console.log(window.outerWidth) // 2560

$('html').clientWidth   // 1032
// or document.documentElement.clientWidth
```