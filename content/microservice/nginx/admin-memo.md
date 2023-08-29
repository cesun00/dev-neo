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
server {
    server_name example.com www.example;
}
```

Use `_` as a default capture-all name:

https://stackoverflow.com/questions/9454764/nginx-server-name-wildcard-or-catch-all

```nginx
server {
    server_name _;
}
```


Use `*` for prefix or suffix glob. Nginx calls this feature "wildcard name".
Note that `*` will **not** expand to empty string; thus the following won't match `example.com`.

```nginx
server {
    server_name *.example.com www.example.*;
}
```

[RFC1034](https://datatracker.ietf.org/doc/html/rfc1034#section-3.5) mandates that domain name can't start with `.`.
Nginx use this syntax as a shortcut, and the following lines are identical:

```nginx
server_name .example.com;                   # shortcut for
server_name example.com *.example.com;
```

Perl (?) regex starts with `~`:

```nginx
server {
    server_name www.example.com ~^www\d+\.example\.com$;
}
```

With (named) capture groups:

```nginx
server {
    server_name ~^(www\.)?(?<domain>.+)$;

    location / {
        root /sites/$1/$domain;
    }
}
```

If multiple rules match an incoming request, the priority is:

1. exact match
2. longest matching prefix glob
3. longest matching suffix glob
4. first matching regex in config literal order after include.


## Variables

Builtin variable can be referred in conf file by a dollar prefix: `$document_root`.

Depending on the context, variable expand to different values:

Notable variables:

- `$uri`
- `$document_root`