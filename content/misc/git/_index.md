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

已知：
git merge --abort没用；不存在git stash --abort之类的指令；conflict files里会产生临时diff lines

方案：
1. 要么`git reset --hard HEAD`回退；
    https://stackoverflow.com/questions/8515729/aborting-a-stash-pop-in-git
2. 要么修改diff lines解决冲突

## The `git-prompt.sh` issue

My previous `PS1` was like:

*(see [](../linux/bash-memo.md) for the Trick: concatenation of single quote and double quote strings)*

```bash
set_fg_green="$(tput setaf 42)"
set_fg_what="$(tput setaf 133)"
reset_color='\[\e(B\e[m\]'

PS1="${set_fg_green}[\u@\h \W${set_fg_what}"'$(__git_ps1 " (%s)")'"${set_fg_green}]\$ ${reset_color}"
```

[Wiki](https://wiki.archlinux.org/title/Git#Git_prompt) mentioned that the `__git_ps1` *command substitution* must be escaped. ...

https://stackoverflow.com/questions/18559417/bash-prompt-line-wrapping-issue

## cheatsheet

#### objects layer

```sh
# list all objects in local repo
git cat-file --batch-check --batch-all-objects
# list all refs
# TODO
```
