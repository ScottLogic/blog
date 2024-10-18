#!/usr/bin/env bash
set -eo pipefail

SCRIPTDIR="$(dirname "$0")"
# Replace e.g. /c/ of Git Bash paths on windows with C:/ to keep Docker happy
REPOROOT="$(realpath "$SCRIPTDIR/.." | sed 's/^\/\([a-z]\)\//\u\1:\//')"

CONTAINER_WORKDIR=/srv/jekyll

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if [[ -z "$BLOG_USERNAME" ]]; then
  >&2 echo -e "${Red}BLOG_USERNAME env var not set.${NC}"
  >&2 echo -e "Set it to the username derived from your Scott Logic email address.\nFor example, for ABirch@scottlogic.com:"
  >&2 echo -e "${Purple}export BLOG_USERNAME=abirch${NC}"
  exit 1
fi

SERVE_MOUNTS=(
  _data
  _includes
  _layouts
  _posts
  _uploads
  assets
  category
  scripts
  scss
  404.html
  _config.yml
  _prose.yml
  atom.xml
  CNAME
  Enter
  index.html
  script.js
  style.css
  scott-logic-block.markdown
  robots.txt
)

SERVE_MOUNT_ARGS=()
for fname in "${SERVE_MOUNTS[@]}"; do
  SERVE_MOUNT_ARGS+=(-v "$REPOROOT/$fname":"$CONTAINER_WORKDIR/$fname":ro)
done

# accept PORT env var, fallback to 4000 if unspecified
: "${PORT:=4000}"

set -x

# run jekyll serve
# https://jekyllrb.com/docs/configuration/options/
exec docker run -it --rm --init \
--name sl-jekyll-run \
-v "$REPOROOT/$BLOG_USERNAME":"$CONTAINER_WORKDIR/"$BLOG_USERNAME":ro" \
-v "$REPOROOT/container_gem_cache":"$CONTAINER_WORKDIR/.bundle:ro" \
"${SERVE_MOUNT_ARGS[@]}" \
-v "$REPOROOT/dist":/dist \
-p "$PORT":"$PORT" \
-p 35729:35729 \
-p 3000:3000 \
jekyll/jekyll:3.8.6 jekyll serve --livereload -d /dist --port "$PORT" --incremental