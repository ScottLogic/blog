#!/usr/bin/env bash
set -eo pipefail

SCRIPTDIR="$(dirname "$0")"
REPOROOT="$(realpath "$SCRIPTDIR/..")"

CONTAINER_WORKDIR=/srv/jekyll

touch "$REPOROOT/Gemfile.lock"

set -x

# runs `bundle install` to fetch the gem dependencies listed in our Gemfile + Gemfile.lock,
# and installs them to container_gem_cache (which we output to the host OS).
# if our Gemfile.lock is currently empty: the container will resolve deps and output one for us
# https://bundler.io/v2.4/man/bundle-install.1.html
exec docker run -it --rm --init \
--name sl-blog-gem-install \
-v "$REPOROOT/Gemfile":"$CONTAINER_WORKDIR/Gemfile":ro \
-v "$REPOROOT/Gemfile.lock":"$CONTAINER_WORKDIR/Gemfile.lock" \
-v "$REPOROOT/container_gem_cache":/usr/local/bundle \
jekyll/jekyll:3.8.6 bundle