#!/usr/bin/env bash
set -euo pipefail
REPO=/home/smktelkom/projects/smk-telkom-purwokerto
ROOT=/home/smktelkom/public_html/flexbox
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP=/home/smktelkom/public_html/flexbox-backup-$STAMP
cd "$REPO"
git fetch origin main
TARGET=$(git rev-parse origin/main)
CURRENT=$(git rev-parse HEAD)
echo "CURRENT=$CURRENT"
echo "TARGET=$TARGET"
mkdir -p "$BACKUP"
rsync -a "$ROOT/" "$BACKUP/"
echo "BACKUP=$BACKUP"
if [ -n "$(git status --porcelain)" ]; then
  git stash push -u -m "pre-sync-$STAMP"
fi
git checkout main
git merge --ff-only origin/main
test "$(git rev-parse HEAD)" = "$TARGET"
cd "$REPO/frontend"
npm ci --no-audit --prefer-offline
npm run lint
npm run bahasa:uji
npm run build
HTACCESS_SHA=$(sha256sum "$ROOT/.htaccess" | awk '{print $1}')
rsync -a --delete --exclude='.htaccess' "$REPO/frontend/dist/" "$ROOT/"
test "$(sha256sum "$ROOT/.htaccess" | awk '{print $1}')" = "$HTACCESS_SHA"
chown -R smktelkom:nobody "$ROOT"
find "$ROOT" -type d -exec chmod 755 {} +
find "$ROOT" -type f -exec chmod 644 {} +
echo "DEPLOYED=$(git -C "$REPO" rev-parse HEAD)"
echo "HTACCESS_SHA=$HTACCESS_SHA"
