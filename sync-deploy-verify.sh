#!/usr/bin/env bash
set -euo pipefail
REPO=/home/smktelkom/projects/smk-telkom-purwokerto
ROOT=/home/smktelkom/public_html/flexbox
BACKUP=/home/smktelkom/public_html/flexbox-backup-$(date +%Y%m%d-%H%M%S)
cd "$REPO"
git fetch origin main
TARGET=$(git rev-parse origin/main)
CURRENT=$(git rev-parse HEAD)
echo "CURRENT=$CURRENT"
echo "TARGET=$TARGET"
mkdir -p "$BACKUP"
rsync -a "$ROOT/" "$BACKUP/"
echo "BACKUP=$BACKUP"
if [ -n "$(git status --porcelain)" ]; then git stash push -m "pre-sync-$(date +%Y%m%d-%H%M%S)"; fi
git checkout main
git merge --ff-only origin/main
[ "$(git rev-parse HEAD)" = "$TARGET" ]
cd "$REPO/frontend"
npm install --no-audit --prefer-offline
npm run lint
npm run bahasa:uji
npm run build
HT=$(sha256sum "$ROOT/.htaccess" | awk '{print $1}')
rsync -a --delete --exclude='.htaccess' "$REPO/frontend/dist/" "$ROOT/"
[ "$(sha256sum "$ROOT/.htaccess" | awk '{print $1}')" = "$HT" ]
chown -R smktelkom:nobody "$ROOT"
find "$ROOT" -type d -exec chmod 755 {} +
find "$ROOT" -type f -exec chmod 644 {} +
echo "DEPLOYED=$(git -C "$REPO" rev-parse HEAD)"
echo "HTACCESS_SHA=$HT"
