#!/usr/bin/env bash
set -euo pipefail

REPO="/home/smktelkom/projects/smk-telkom-purwokerto"
DOCROOT="/home/smktelkom/public_html/flexbox"
BACKUP_DIR="/home/smktelkom/public_html/flexbox-backup-$(date +%Y%m%d-%H%M%S)"

echo "=== STEP 1: Git Status & Fetch ==="
cd "$REPO"
git fetch origin main
LATEST_REMOTE=$(git rev-parse origin/main)
CURRENT_LOCAL=$(git rev-parse HEAD)
echo "Current VPS commit: $CURRENT_LOCAL"
echo "Target origin/main: $LATEST_REMOTE"

echo "=== STEP 2: Backup Website ==="
if [ -d "$DOCROOT" ]; then
  mkdir -p "$BACKUP_DIR"
  rsync -a "$DOCROOT/" "$BACKUP_DIR/"
  echo "Backup created at: $BACKUP_DIR"
else
  echo "DOCROOT does not exist: $DOCROOT"
  exit 1
fi

echo "=== STEP 3: Safe Git Update (Fast-forward) ==="
# Cek perubahan lokal di repo
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes found in VPS repo. Stashing..."
  git stash push -m "pre-deploy-stash-$(date +%Y%m%d%H%M%S)"
fi

git checkout main
git merge --ff-only origin/main
UPDATED_COMMIT=$(git rev-parse HEAD)
echo "Updated to commit: $UPDATED_COMMIT"

if [ "$UPDATED_COMMIT" != "$LATEST_REMOTE" ]; then
  echo "Error: HEAD does not match origin/main!"
  exit 1
fi

echo "=== STEP 4: Install, Lint, Test & Build ==="
cd "$REPO/frontend"
npm install --no-audit --prefer-offline || npm install
npm run lint || true
npm run bahasa:uji || true
npm run build

echo "=== STEP 5: Deploy to Document Root ==="
# Simpan hash .htaccess lama jika ada
HTACCESS_PATH="$DOCROOT/.htaccess"
if [ -f "$HTACCESS_PATH" ]; then
  HT_OLD_HASH=$(sha256sum "$HTACCESS_PATH" | awk '{print $1}')
  echo "Original .htaccess SHA: $HT_OLD_HASH"
fi

rsync -a --delete --exclude='.htaccess' "$REPO/frontend/dist/" "$DOCROOT/"

# Verifikasi .htaccess tetap utuh
if [ -f "$HTACCESS_PATH" ]; then
  HT_NEW_HASH=$(sha256sum "$HTACCESS_PATH" | awk '{print $1}')
  echo "Post-deploy .htaccess SHA: $HT_NEW_HASH"
  if [ -n "${HT_OLD_HASH:-}" ] && [ "$HT_OLD_HASH" != "$HT_NEW_HASH" ]; then
    echo "Warning: .htaccess modified! Restoring..."
    cp "$BACKUP_DIR/.htaccess" "$HTACCESS_PATH"
  fi
fi

# Set permissions
chown -R smktelkom:nobody "$DOCROOT"
find "$DOCROOT" -type d -exec chmod 755 {} +
find "$DOCROOT" -type f -exec chmod 644 {} +

echo "=== STEP 6: Verification ==="
echo "Document root file list preview:"
ls -lah "$DOCROOT" | head -n 15

echo "Latest index.html preview:"
head -n 20 "$DOCROOT/index.html"

echo "=== DEPLOYMENT COMPLETED ==="
