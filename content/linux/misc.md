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
`/tmp`


## image magick

### Scale to height/width, keeping aspect ratio

```bash
convert -geometry 25x src.png out.png # resize image to width 25, keeping aspect ratio
convert -geometry x25 src.png out.png # resize image to height 25, keeping aspect ratio
```

or

```bash
convert src.png -resize 25x out.png # resize image to width 25, keeping aspect ratio
```

### Scale by percentage

```bash
convert scaled_visa_f1_photopage.jpg -resize 70% output.jpg
```

### Splice (orderly)

Width/Height of the resulting image will be the maximum width/height among all inputs. Gaps due to alignment will be white (and I don't see options to change it).

```bash
convert -append 1.jpg 2.jpg out.jpg # vertically
convert +append 1.jpg 2.jpg out.jpg # horizontally
```

## symbol versioning

https://stackoverflow.com/questions/2856438/how-can-i-link-to-a-specific-glibc-version
https://man7.org/conf/lca2006/shared_libraries/slide19a.html
