#!/usr/bin/env bash
# Take in a base ref. Gets the files that have changed from the base to the HEAD.
# Export the list as a CommonJS module for the pa11y-ci configuration to use.
# Typical usage: generate_pa11y_ci_urls_from_git_diff.sh gh-pages > .pa11yci.js
# Assumes git is installed and on the path.

function generate_pa11y_ci_urls_from_git_diff {
  base_ref=$1
  if [ -z "$base_ref" ]; then
    echo "No Git base ref provided. Usage: $0 <base_ref>"
    exit 1
  fi

  changed_files=$(git diff --name-only $base_ref)

  echo -n "module.exports=[";
  for file in $changed_files; do
    if [[ $file == _posts/* ]]; then
      echo -n "'/$(url_of_post $file)',";
    # _includes and _layouts don’t correspond to pages on the blog. If someone
    # changes these files, they should run a test on the whole blog.
    elif [[ \
      $file == *.html \
      && ! ( $file == _includes/* || $file == _layouts/* ) \
    ]]; then
      echo -n "'/$(url_of_page $file)',";
    fi
  done
  echo -n "];";
}

function url_of_page {
  # Remove trailing /index.html, index.html or .html
  echo $1 | sed "s/\(\/\?index\)\?\.html$//";
}

function url_of_post {
  year="\([0-9][0-9][0-9][0-9]\)"
  month="\([0-9][0-9]\)"
  day="\([0-9][0-9]\)"
  slug="\(.*\)"
  file_ext="\(html\|markdown\|md\)"

  echo $1 | sed "s/^_posts\/$year-$month-$day-$slug\.$file_ext$/\1\/\2\/\3\/\4.html/";
}

generate_pa11y_ci_urls_from_git_diff $1

