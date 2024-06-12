---
title: "Loader"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

When a `<script>` tag is encountered in an HTML document, the browser immediately stops all its HTML parsing,
fetch the script from an external URL if necessary, and execute the JavaScript code.

As a special case, if the executing JavaScript programmatically appends a new `<script>` tag to the DOM, ... .
This technique is frequently used by various module loader since 2006.

The HTML parsing job resumes after the control flow reaches the end of the top-level JS scope.

 If it's an external script instead of an inline one, i.e. `src="..."` refers to an HTTP URL,
a new HTTP request will be initiated before it can be executed - a network I/O that can block the page for huge amount of time.

This stop-the-world behavior has several important consequences:
1. asdasda

    ```html
        <div class="foo"></div> 
        <div class="foo"></div> 

        <script>
        console.log(document.querySelectorAll('.foo').length); // 2
        console.log(document.querySelector('#bar')); // null
