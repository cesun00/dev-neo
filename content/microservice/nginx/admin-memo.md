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

```bash
nginx -p . -c nginx.conf
```

## Cross-Site

```nginx
server {
        listen       80;
        server_name  .cbs.example.com;
        ssi on;

        error_page 403 404 http://www.example.com/404.html;
        error_page   500 502 503 504    http://www.example.com/404.html;

        access_log   logs/app_access.log ;
        error_log   logs/app_error.log;


        location / {
                if ($http_origin ~ (example|alt-example)\.com(:\d+)?$) {
                        add_header 'Access-Control-Allow-Origin' "$http_origin";
                        add_header 'Access-Control-Allow-Credentials' "true";
                        add_header 'Access-Control-Allow-Methods' "GET,POST,OPTIONS";
                        add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,X-Data-Type,X-Requested-With';
                }

                proxy_set_header    Host test.cbs.example.com;
                proxy_set_header    X-Real-IP $remote_addr;
                proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://172.21.178.185:19010;
        }
}
```

https://serverfault.com/a/716283

## Wildcard CORS

## Credentialed CORS

Scope: `server` / `location`:

```nginx
    if ($http_origin = ''){
        set $http_origin "*";
    }

    proxy_hide_header Access-Control-Allow-Origin;
    add_header Access-Control-Allow-Origin $http_origin;
```

## Directive Memo

http://nginx.org/en/docs/dirindex.html

### [`server_name`](http://nginx.org/en/docs/http/ngx_http_core_module.html#server_name)

See also: http://nginx.org/en/docs/http/server_names.html

同端口多 virtual host 的时候，用 `Host` header 来区分具体适用的配置。

Exact match, multiple names are supported:

```nginx
