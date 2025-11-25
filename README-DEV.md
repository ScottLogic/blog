# Blog Development
Useful things for working the blog itself (not blog posts).

## Setup
See [README.md](README.md).
It has everything needed to get the blog up and running.

## HTML
Base layouts must be in `_layouts` and components must be in `_includes`.
Within components, prefer passing variables in using `{%- include foo.html bar=baz -%}` rather than using the page
context.
This allows for includes to be cached using `{%- include_cached ... -%}` if they begin to consume too much build time.

A few custom filters are provided by the `custom-filters` plugin:
- `starts_with` - returns true if the given string starts with a given string
  - `"https://example.com" | starts_with: "https"` resolves to `true`
  - `"ftp://example.com" | starts_with: "https"` resolves to `false`
  - `nil | starts_with: "https:"` resolves to `false`
- `ends_with` - returns true if the given string ends with a given string
  - `"foo.html" | ends_with: "html"` resolves to `true`
  - `"foo.scss" | ends_with: "html"` resolves to `false`
  - `nil | ends_with: "html"` resolves to `false`

## Styles
Blog stylesheets must be in `scss/`, be a partial stylesheet (be prefixed with an `_`) and `@use`'d by either 
`assets/style.scss` or a stylesheet already `@use`'d by `assets/style.scss`.

For example, the styles related to the author list are in `scss/_author-list.scss`, which is `@use`d by
`assets/style.scss`, but `scss/_colours.scss` isn't `@use`'d by `assets/style.scss`.
Rather `_colours` is `@use`d by other stylesheets such as `_author-list.scss`.

Avoid deprecated SCSS features like `@import` where possible.
If it cannot be avoided, include a comment with the reason why.
For example `_util.scss` uses `@import` because the foundations framework still requires it.

All stylesheets reachable from `assets/style.scss` are compiled and minified into `_site/assets/style.css` as part of
the build process, using Jekyll's builtin SCSS support.

## Scripts
Blog scripts should be in `scripts/` and preferably be TypeScript (type safety is king).
Where possible, try and import new scripts into `scripts/index.ts`.
If this isn't possible, add the new script to `rspack.config.ts`'s `entry.page` array.

The scripts are compiled, concatenated and minified using a custom build hook that triggers `rspack build`.

## Build Hook
To aid in development, arbitrary commands can be run at different Jekyll hooks by adding entries to `_config.yml`'s
`hook_exec` entry.

Each entry has the following structure:
```yaml
hook_exec:
  owner:
    event:
      name:
        cmd: string
        env: optional map
        priority: optional int
```
where:
- `owner` and `event` are from the list in the [Jekyll docs](https://jekyllrb.com/docs/plugins/hooks/#built-in-hook-owners-and-events)
with the `:` removed.
- `name` is a useful identifier for logging
- `cmd` is the command to run
  - The value is treated as a [liquid template](https://shopify.github.io/liquid/)
- `env` is a map of environment variables
  - Values in the map are treated as [liquid template](https://shopify.github.io/liquid/)
- `priority` is the priority of the hook with higher values being run first

Liquid templates have access to the following variables, depending on which hook they are running in:
- `site` - hooks with `:site` owner
  - Same as the `site` object in normal templates
- `doc` - hooks with `:document` owner
  - [Jekyll document](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/document.rb)
- `page` - hooks with `:pages` owner
  - Same as the `page` object in normal template
- `payload` - hooks with either the `:pre_render` or `:post_render` event
  - a hash containing variables to be used during rendering (`:pre_render`) or their final values after rendering 
(`:post_render`)
- `files` - hooks with `:clean` owner
  - list of [files](https://ruby-doc.org/3.4.1/File.html) to be deleted

For example, the `:site` `:pre_render` hook has the `site` and `payload` variables.

These templates do not have access to [Jekyll specific filters and tags](https://jekyllrb.com/docs/liquid/).

If a command produces a file in `_site`, it must be added to `_config.yml`'s `keep_file` list to prevent Jekyll from
removing it as part of the build.

This is primarily used to invoke external build commands.
Anything more complicated should be implemented as a custom plugin, similar to the `html-minify` plugin.