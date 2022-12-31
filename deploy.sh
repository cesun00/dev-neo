#!/bin/bash

set -e

rm -rf public
hugo --minify
cd public

git init
git add .
git commit -m "new release"
git branch -M main
git remote add origin git@cesun00-github:cesun00/cesun00.github.io.git
git push -f -u origin main
