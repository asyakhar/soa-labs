#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Загружается только документация; исходники проекта и node_modules не публикуются.
npm run check
remote='s409792@helios.se.ifmo.ru'
ssh -p 2222 "$remote" 'mkdir -p ~/public_html/soa-lab-1 && chmod 755 ~/public_html ~/public_html/soa-lab-1'
scp -P 2222 -r index.html openapi.yaml openapi.bundle.json components vendor "$remote:public_html/soa-lab-1/"
ssh -p 2222 "$remote" 'find ~/public_html/soa-lab-1 -type d -exec chmod 755 {} \; && find ~/public_html/soa-lab-1 -type f -exec chmod 644 {} \;'
printf '%s\n' 'Загружено. Проверьте https://se.ifmo.ru/~s409792/soa-lab-1/'
curl --fail --location --output /dev/null --show-error 'https://se.ifmo.ru/~s409792/soa-lab-1/'
