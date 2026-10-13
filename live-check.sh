#!/usr/bin/env bash
set +e
for scheme in http https; do
  echo "====$scheme"
  curl -4 -k -sS -o /dev/null -w '%{http_code} %{url_effective}\n' "${scheme}://flexbox.smktelkom-pwt.sch.id/"
done
curl -4 -k -sS -I https://flexbox.smktelkom-pwt.sch.id/