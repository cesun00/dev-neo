---
title: "HTTP Streaming"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

This section discusses various historical or currently popular techniques that make possible
video delivery on the web.

The most intuitive way perhaps being the `<video>` tag whose `src` refers to a remote URL.

Depending on whether the `preload`

{{<columns>}}

## REQUEST

```http
GET /Download_video.mp4 HTTP/1.1
Accept: */*
Accept-Encoding: identity;q=1, *;q=0
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
Host: localhost
Range: bytes=0-
Referer: http://localhost/
