#!/bin/bash

export all_proxy=socks5h://localhost:1080

git submodule init
git submodule update --progress

