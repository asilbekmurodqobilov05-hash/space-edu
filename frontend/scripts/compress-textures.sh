#!/usr/bin/env bash
#
# Compress the textures inside the remaining large .glb models (ticket Q3, tail).
#
# Geometry is already Draco-compressed — that is what took the served assets
# from 246 MB to 20 MB. What is left is texture data: ten models still weigh
# 2 MB or more each, 48 MB between them, and almost all of it is uncompressed
# PNG and JPEG baked into the container.
#
# RUN THIS ON LINUX, WSL, OR IN CI. `gltf-transform --texture-compress` shells
# out to libvips, and the Windows build fails with a colourspace error before it
# writes anything. Geometry compression works fine on Windows; this does not.
#
#   cd frontend
#   bash scripts/compress-textures.sh            # rewrite in place
#   bash scripts/compress-textures.sh --dry-run  # report the savings only
#
# Afterwards: play the game and look at it. WebP inside a .glb is decoded by the
# browser, not by three.js, so the risk is not a crash — it is a texture that
# quietly looks worse. Then update MAX_TRACKED_FILE_SIZE_BYTES in the CI hygiene
# job so the new floor is the one being held.
set -euo pipefail

cd "$(dirname "$0")/.."

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

if ! command -v gltf-transform >/dev/null 2>&1; then
  echo "gltf-transform is not installed. Install it with:" >&2
  echo "  npm install -g @gltf-transform/cli" >&2
  exit 1
fi

if [ "$(uname -s)" != "Linux" ] && [ "$(uname -s)" != "Darwin" ]; then
  echo "This needs libvips, which fails on Windows. Use WSL, Linux, or CI." >&2
  exit 1
fi

MODELS=$(find public/models public/*.glb -name '*.glb' -size +2M 2>/dev/null | sort)

if [ -z "$MODELS" ]; then
  echo "Nothing over 2 MB left. Ticket Q3 can close."
  exit 0
fi

total_before=0
total_after=0

for model in $MODELS; do
  before=$(wc -c < "$model")
  tmp="${model}.compressed"

  # webp at quality 85 is the point where these particular textures stop losing
  # anything visible; 2048 is larger than any of them is rendered at.
  gltf-transform webp "$model" "$tmp" --quality 85 >/dev/null 2>&1 || {
    echo "  FAILED: $model (left untouched)" >&2
    rm -f "$tmp"
    continue
  }
  gltf-transform resize "$tmp" "$tmp" --width 2048 --height 2048 >/dev/null 2>&1 || true

  after=$(wc -c < "$tmp")
  total_before=$((total_before + before))
  total_after=$((total_after + after))

  printf '  %-70s %6s KB -> %6s KB\n' "$(basename "$model")" \
    "$((before / 1024))" "$((after / 1024))"

  if [ "$DRY_RUN" = "1" ] || [ "$after" -ge "$before" ]; then
    rm -f "$tmp"
  else
    mv "$tmp" "$model"
  fi
done

echo
printf 'Total: %s KB -> %s KB\n' "$((total_before / 1024))" "$((total_after / 1024))"
[ "$DRY_RUN" = "1" ] && echo '(dry run — nothing was written)'
