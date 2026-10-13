#!/usr/bin/env bash
set -euo pipefail

HOST="flexbox.smktelkom-pwt.sch.id"
echo "=== Checking Local Apache HTTP (Port 80) ==="
for path in "/" "/guru" "/fasilitas"; do
  code=$(curl -s -o /tmp/resp.txt -w '%{http_code}' -H "Host: $HOST" "http://127.0.0.1$path")
  echo "GET $path -> HTTP $code"
  head -n 5 /tmp/resp.txt
  echo "---"
done

echo "=== Checking Static Asset ==="
asset=$(find /home/smktelkom/public_html/flexbox/assets -type f -name '*.js' | head -n 1 | sed 's#/home/smktelkom/public_html/flexbox##')
echo "Testing asset: $asset"
asset_code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $HOST" "http://127.0.0.1$asset")
echo "Asset HTTP code: $asset_code"

echo "=== Checking .htaccess Protection ==="
ht_code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $HOST" "http://127.0.0.1/.htaccess")
echo ".htaccess HTTP code: $ht_code"
