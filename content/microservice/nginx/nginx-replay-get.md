---
title: "Nginx Replays Your Non-Idempotent Time-Consuming GET"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

We recently brought a report-generation feature from the test environment to production.
The main flow was designed as a scheduled task, but it turned out that our PM changed his idea
and made it an API call manually triggered by DevOps engineers:

```java
@GetMapping("/main")
@XLock(prefix = "AUTOERP", keys = {}, waitTime = 2, timeUnit = TimeUnit.SECONDS)
public void autoerp() {
    
    // ... heavy-duty DB and RPC operations that take about 20 minutes

    autoerpNotifyService.report();
}
```

Eventually, a report is generated depending on the DB state after the computation by rendering a Thymeleaf template.
If using Thymeleaf in this non-Web scenario seems interesting to you, you may want to check out this [how-to]({{<ref "../../java/spring/thymeleaf-without-mvc.md">}}).

Everything went smoothly during the test: the response took some time and the connection was long-lasting - nothing bad about that; the distributed lock guaranteed that no dirty view was read by a second instance for k8s deployment, and freed us from the old-fashioned DB-based pessimistic locking.

Problems cropped up once we moved to the production environment.
From the HTTP client's perspective, the long connection was cut at the 120-th second by nginx and a 502 bad gateway was returned.
Initially, I thought it wasn't particularly bad, since the application server is still running and the report still gets emailed.

But as it turns out, everything got done twice, despite that only one HTTP GET was made by the client:

1. the application gateway logged the arrivals of 2 calls:

    ```log
    # [dev@VM-4-46-centos cloud-gateway]$ grep '/task/main' $(ls -t | head)
