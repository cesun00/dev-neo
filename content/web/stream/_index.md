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
Sec-Fetch-Dest: video
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36
sec-ch-ua: "Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
```

<--->

## RESPONSE

```http
GET /Download_video.mp4 HTTP/1.1
Accept: */*
Accept-Encoding: identity;q=1, *;q=0
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
Host: localhost
If-Range: "s9t0jbjmcat"
Range: bytes=32243712-32955076
Referer: http://localhost/
Sec-Fetch-Dest: video
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36
sec-ch-ua: "Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
```

{{</columns>}}