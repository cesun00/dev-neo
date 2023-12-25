---
title: "misc"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

## udisksctl

https://unix.stackexchange.com/questions/35508/eject-usb-drives-eject-command

```bash
# poweroff an external usb drive by -b <DEVICE>
udisksctl power-off -b /dev/sda
```

## Capabilities

- man 8 setcap
- man 8 capabilities
- https://unix.stackexchange.com/questions/427243/setting-time-with-clock-settime-without-having-root-access
- https://unix.stackexchange.com/questions/78299/allow-a-specific-user-or-group-root-access-without-password-to-bin-date

```sh
sudo setcap CAP_SYS_TIME+ep  /path/to/program
```

## FHS

`man 7 hier`

- `/run`: must be "cleared" between system boot - required by FHS.
    program must have subdirectory rather than direct put files there.
    pid file must be put here. - robustness principle
    domain socket must be placed here
`/var`
