---
title: "Use value from Powershell's hashtable as CLI flags to external program"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
credit:
    - https://stackoverflow.com/questions/10754582/string-interpolation-of-hashtable-values-in-powershell
---

Recently I have been working on a set of scripts that boot some depending services for my web crawler team.
The production environment is Windows Server 2013, so the obvious choice is powershell.

> and there is no good reason to go back to classic cmd - unless you are a retro-computation hobbiest! :)

Powershell provides nice builtin data structures, and we used a hash table to group all the config in one place
for the ease of modification. Note that the value has type, and in this case they are all just `String`:

```ps1
$CONFIG = @{
    app_id = "2023xxxxxxx";
    app_secret = "MIIEvQIBADANBgkqhkiG9xxxx";
    group_code = "1xxxxx";
}
```

Now to access value by a key you just:

```ps1
# print to console
Write-Host $CONFIG.app_id
