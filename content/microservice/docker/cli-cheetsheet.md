---
title: "Docker CLI Cheetsheet"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---







```sh
# show active container
docker container ls
# show all container includes dead one
docker container ls -a
# stop certain containers
docker stop <cid1> <cid2> ...
# stop all active containers
docker stop $(docker container ls –aq)
```
