#!/usr/bin/env bash
set -euo pipefail
repo=/home/smktelkom/projects/smk-telkom-purwokerto
src="$repo/frontend/dist"
root=/home/smktelkom/public_html/flexbox
ht_before=$(sha256sum "$root/.htaccess" | awk '{print $1}')
rsync -a --delete --exclude='.htaccess' "$src/" "$root/"
ht_after=$(sha256sum "$root/.htaccess" | awk '{print $1}')
test "$ht_before" = "$ht_after"
chown -R smktelkom:nobody "$root"
find "$root" -type d -exec chmod 755 {} +
find "$root" -type f -exec chmod 644 {} +
test "$(sha256sum "$root/.htaccess" | awk '{print $1}')" = "c50d3f98727a83d53b7f9cc63ad85331704788eecb11b4b9b078b4613345f613"
sha256sum "$root/.htaccess"
find "$root" -maxdepth 2 -type f -printf '%M %u:%g %p\n' | sort
base=https://flexbox.smktelkom-pwt.sch.id
for path in / /guru /fasilitas; do
  code=$(curl -ksS -o /tmp/jhic-body -w '%{http_code}' "$base$path")
  test "$code" = 200
  grep -q '<!doctype html' /tmp/jhic-body || grep -q '<html' /tmp/jhic-body
  echo "$path HTTP $code"
done
asset=$(find "$root/assets" -maxdepth 1 -type f | head -n 1 | sed "s#^$root##")
test -n "$asset"
code=$(curl -ksS -o /dev/null -w '%{http_code}' "$base$asset")
test "$code" = 200
echo "$asset HTTP $code"
headers=$(curl -ksSI "$base/")
echo "$headers" | grep -qi 'cache-control: public, max-age=0, must-revalidate'
echo "$headers" | grep -qi 'HTTP/.* 200'
secret_code=$(curl -ksS -o /dev/null -w '%{http_code}' "$base/.htaccess")
test "$secret_code" != 200
echo "/.htaccess HTTP $secret_code"
