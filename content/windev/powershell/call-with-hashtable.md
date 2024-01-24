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
Write-Host $CONFIG.app_secret
```

Problem happens when I tried to fork-exec the external service:

```ps1
$connector_exe = "located_from_win_registry.exe"

& "$connector_exe" `
    --server_mode=http `
    --threads=10 `
    --http_port=6873 `
    --app_id=$CONFIG.app_id  `
    --app_secret=$CONFIG.app_secret  `
    --group_code=$CONFIG.group_code
```

`connector.exe` keeps warning me that `app_secret` doesn't pass authentication.
This is weird because, if you inline the literal value of these 3 fields into the CLI invocation, everything is fine.

After perusing the error messages, I found `connector.exe` claimed that it received something like `"System.Collections.Hashtable.app_secret"` as `app_secret`. Obvious something was wrong with parameter substitution that happens only when
the call operator (`&`) is used.

It turned out that the call operator works by first stringize each whitespace-separated token, and then send them to windows's
fork-exec syscall flows, with the first token string as command name. So our CLI arguemnts actually looks like:

```ps1
& "$connector_exe" "--app_id=$CONFIG.app_id" "--app_secret=$CONFIG.app_secret" "--group_code=$CONFIG.group_code" # ...
```

This is why the Powershell's common string interpolation rules comes into the play.
What `connector.exe` received is stringized `$CONFIG` which is a `Hashtable` object thus `"System.Collections.Hashtable"`, concatenated with whatever string literal that follows.

You may recall that *powershell allows space in variable name*, and occurrence of such name must be surrounded with braces:

```ps1
