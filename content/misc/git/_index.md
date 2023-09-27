---
title: "The Git SCM"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Scenario FAQ

### 误删了untracked的文件，唯一的记录是某个已经pop掉的stash

1. 找到已pop的stash的hash
    
    ```bash
    git fsck --no-reflog | awk '/dangling commit/ {print $3}'
    ```
    https://stackoverflow.com/questions/89332/how-to-recover-a-dropped-stash-in-git

2. `git stash show -p -u ${STASH_HASH}`

    - `-p`  print diff
    - `-u`  include untracked

    https://stackoverflow.com/questions/10725729/see-whats-in-a-stash-without-applying-it


### remote已经删除某branch，本地同步该事实

`git fetch [-p | --prune]`


否则git fetch只为本地添加remote新增branch的metainfo，不主动删除

https://stackoverflow.com/questions/5751582/fetch-from-origin-with-deleted-remote-branches

### git stash pop 和当前 working tree冲突

