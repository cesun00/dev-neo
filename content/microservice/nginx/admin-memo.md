---
title: "Nginx Administrative Memo"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Run nginx instance with an alternative config

minimal conf:

```nginx
daemon off;
master_process off;

pid /home/myuser/local_nginx/nginx.pid;

http {
    # ...
    client_body_temp_path /home/cesun/local_nginx/;
    fastcgi_temp_path /home/cesun/local_nginx/;
    uwsgi_temp_path /home/cesun/local_nginx/;
    scgi_temp_path /home/cesun/local_nginx/;

    access_log /home/cesun/local_nginx/access.log;
}
```

Run with
