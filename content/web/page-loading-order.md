---
title: "Browser Page Loading Order"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## `<script defer>`

## `<script async>`

## `<script type="module">` are always executed asynchronously

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkbox Event Listener</title>
</head>

<body>
    <script>
        console.log(document.querySelector('#findme')); // null
    </script>

    <script type="module">
        console.log(document.querySelector('#findme')); // the <p> located
    </script>

    <p id="findme">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, earum harum, amet ut perspiciatis
        voluptatibus voluptatem accusamus sed et consequatur beatae cumque repudiandae, id vero? Eveniet rerum soluta
        similique reiciendis!</p>
</body>
