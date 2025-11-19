source 'http://rubygems.org'
ruby '~> 3.3'

gem "jekyll", "~> 4"
group :jekyll_plugins do
    # Deps from EOL github-pages gem minus themes
    gem "jekyll-avatar"
    gem "jekyll-commonmark"
    gem "jekyll-default-layout"
    gem "jekyll-feed"
    gem "jekyll-gist"
    gem "jekyll-github-metadata"
    gem "jekyll-include-cache"
    gem "jekyll-mentions"
    gem "jekyll-optional-front-matter"
    gem "jekyll-readme-index"
    gem "jekyll-redirect-from"
    gem "jekyll-relative-links"
    gem "jekyll-remote-theme"
    gem "jekyll-sass-converter"
    gem "jekyll-seo-tag"
    gem "jekyll-sitemap"
    gem "jekyll-swiss"
    gem "jekyll-titles-from-headings"
    gem "jemoji"
    gem "kramdown"
    gem "kramdown-parser-gfm"
    gem "liquid"
    gem "mercenary"
    gem "minima"
    gem "nokogiri"
    gem "rouge"
    gem "terminal-table"
    gem "webrick", "~> 1.7"

    gem 'jekyll-paginate'

    gem "tzinfo-data", "~> 1.2022"

    gem "html-minify", "1.0.0", path: "gems/html-minify-gem"
    gem "hook-exec", "1.0.0", path: "gems/hook-exec-gem"

    # Issue with ffi requiring a very recent rubygems version, not yet available
    # in many current linux docker images, so this must be locked down for now.
    # See https://github.com/ffi/ffi/issues/1103
    gem "ffi", "< 1.17.0"
end