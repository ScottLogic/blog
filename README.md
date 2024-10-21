# Scott Logic Blogs

If you are looking to write a blog post, then you don't _need_ to read any further, as you can author posts using
SiteLeaf: see our [company intranet][confluence-getting-started] for instructions on how to create a new page and view
it before publication on the blog.

The below instructions allow more control over the process, though they do require a smidgen of git knowledge and a
GitHub account.

## Technical Stack

The blog is a static website, designed to be hosted on [GitHub pages][github-pages].

The underlying content is generated through a series of Ruby gems and libraries, starting with a dedicated github-pages
[gem][ruby-github-pages].

Within that stack, [Jekyll][jekyll-docs] is used as the static content generation engine,
consuming template files written in either **HTML** or **Markdown** (syntax extended by [Kramdown][kramdown-syntax]).
Common content or structure can be further injected or managed using the [Liquid][ruby-liquid] templating language.

## Authoring

To write a blog post, it is recommended to fork the repo, then perform a sparse checkout that excludes all previous
posts and all authors other than yourself. This will result in the quickest build.

The alternative is to perform a full checkout and build all posts (more than 15 years' worth!) which can take five
minutes or more to complete. If you are working on technical issues or improvements, then you may need some blog posts
to see the result of your changes; in this case, there is little alternative but to perform a full checkout.

### Fork the repository

At the top of the [ScottLogic blog GitHub repo][scottlogic-blog-repo] you will find the "fork" button. You
will need to be logged into your GitHub account first, then clicking the button will generate your own fork and navigate
to the resulting fork. Then click the <code style="white-space: nowrap">&lt;&gt; Code</code> button at the top to see
your clone options; HTTPS clone is the simplest. Copy the URL, then:

```shell
# Clone your fork without checking anything out:
git clone --depth 1 --filter=blob:none --no-checkout YOUR-REPO-URL-HERE
cd blog

# Optional: tell sparse checkout what to include (excludes _posts by default).
# Use your Scott Logic username in the below command:
git sparse-checkout set _data _includes _layouts assets category scripts scss shell YOUR-SL-USERNAME-HERE
git checkout gh-pages
```

### First-time authors

If this is your first post, you'll need to set yourself up as an author. For this, you will need a directory in the repo
root named after your Scott Logic username. Within this you will need a set of files: `atom.xml`, `feed.xml`,
`index.html`, and an image file of yourself. Just copy an existing author's files and modify their contents: it should
be obvious what needs changing. Then add yourself to `_data/authors.yml`, again using an existing author as a template.
You will need to add

- an entry under `authors`
- your username under `active-authors`

Finally, if you performed a _sparse checkout_ as recommended, you will need to add directory `_posts` in the root of
your local copy.

### Adding a new post

Below is a summary for getting started; for more comprehensive instructions on authoring posts, including markdown
syntax and linking to images, see the pages on our [company intranet][confluence-getting-started].

Within the `_posts` directory, add a markdown file for your new post, named with date and title similar to existing
posts, e.g. `2024-10-31-Your-snappy-post-title.md`. Copy the headers from a recent post, and modify the values for
yours. You may add as many tags (keywords) as you like, but a maximum of two Categories; see `_data/categories.yml` for
our current categories.

Note that Jekyll will not display your post unless the header date is in the past, so if you do not see your post when
running locally, check the date (and time) first. As you can probably guess, this is how you can set a "Go Live" date
in the future, if you don't want your post to appear immediately.

Once you have your skeleton file in place, you can run the blog and start writing. Saving changes should trigger a
rebuild.

### Run the blog locally

By far the easiest route is to use Docker: if you have it installed, you can [skip ahead][run-docker] now!

The blog consists of static HTML pages with content generated using:
- [github-pages][ruby-github-pages] for deployment hooks
- [Jekyll][jekyll-docs] for static site generation generator
- [Kramdown][kramdown-syntax] for an extended markdown syntax
- [Liquid][ruby-liquid] for templating functionality
- [Nokogiri][ruby-nokogiri] for efficient XML and HTML handling, relying on:
  - Native XML Parsers
- [Bundler][ruby-bundler] to manage gems and dependencies
- [Ruby][ruby-downloads].

_In theory_, once you've installed Ruby and Bundler,
given that the project contains a valid [Gemfile][project-gemfile],
then using Bundler should bring in most of the dependencies automatically.
However, due to Nokogiri's reliance on Native XML parsers you may require additional steps.
Thorough instructions for setting up your development environment are detailed below.

#### Prerequisites

First, install Ruby and (if on Linux) a few build dependencies for Nokogiri.

On Linux:

```shell
sudo apt-get install ruby2.3 ruby2.3-dev build-essential dh-autoreconf libxslt-dev libxml2-dev zlib1g-dev
```

On Windows, if you use Chocolatey, simply run `choco install ruby` in a PowerShell instance
with elevated priveleges. If you don't use Chocolatey, you can use [RubyInstaller][rubyinstaller]
or see the Ruby website for [alternative ways to install Ruby][ruby-installation-instructions].
You don't need to install any other dependencies on Windows at this stage.

Secondly, update Gem and install the Jekyll, Bundler and Nokogiri gems.

On Linux:

```shell
sudo gem update
sudo gem install jekyll bundler nokogiri
```

On Windows, in a PowerShell instance with elevated privileges:

```shell
gem update
gem install jekyll bundler nokogiri
```

Thirdly, configure Bundler to store project dependencies in `vendor/bundle`, and,
when in the root directory of your clone of the blog, install the project dependencies.

```shell
bundle config path vendor/bundle
cd PATH/TO/BLOG
bundle install
```

Finally, run `jekyll -v` to check whether Jekyll is working. If so, you're good to run the blog!

#### Running in the native environment

Once you've got all the prerequisites for your operating system, you can run the blog.
Navigate to the root directory of your clone of the blog and execute Jekyll using Bundler.

```shell
bundle exec jekyll serve
```

The blog will then be available on [localhost][localhost].

If you are working on fixes or new features, and need to re-compile the scripts or SCSS, you can use these npm scripts:

```shell
npm ci
npm run scripts
npm run style
```

### Running with Docker

Use a bash-compatible shell; Git bash on Windows should work fine.

#### Install gem dependencies

First, we output gem dependencies to directory `container_gem_cache` on the host machine. This is analogous to running
"npm install" for an npm package:

```shell
./shell/docker-gem-install.sh
```

#### Run in watch mode

Now we can serve the blog with live reloading. Replace "jbloggs" with your ScottLogic username:

```shell
BLOG_USERNAME=jbloggs ./shell/docker-dev-watch.sh
```

It'll take a while to build first time, but once it's done you should see message "done in XXX.YYY seconds".
Then you can navigate to [localhost][localhost] in your browser.

Note that if you performed a _sparse checkout_ as recommended, and if this is your first post, then you won't see any
blog posts when the site loads unless you've already added a file for your new blog post.

## CI/CD

We use GitHub Actions for CI/CD. The workflow definitions are in YAML files
in `.github/workflows`.

### Compress Images Once a Month

Uses the [calibreapp/image-actions][calibreapp-image-actions] Action to
automatically compress images. The compression algorithm is near-lossless. It
compresses all images in the repo once per month, and creates a Pull Request to
merge in the resulting changes.

### Check accessibility of changed content

Runs [pa11y-ci][pa11y-ci] with the aXe test runner to detect some common
accessibility problems. It serves the blog locally and runs the tests on the
rendered webpages. It only checks pages and blog posts which have changed, but
doesn’t take any interest in changes to layouts or includes, so changes to
those should be tested across the whole site separately. This workflow runs on
Pull Requests, pushes to `gh-pages` and on manual dispatches.

### Generate Read More related

Generates Read More links on blog pages across the blog, using the OpenAI API
to determine which blog posts are on similar themes. This workflow runs only on
manual dispatches on the `gh-pages` branch and creates a Pull Request to merge
in the resulting changes.

### Remove Unused Images

For each image in the repo, searches all the blog posts, pages, YAML data files
and JavaScript scripts for any occurrences of its filename. If the filename
occurs nowhere, deletes the image. Then makes a Pull Request to merge in its
changes. This workflow runs only on a manual dispatch on the `gh-pages` branch.

[calibreapp-image-actions]: https://github.com/calibreapp/image-actions
[confluence-getting-started]: https://scottlogic.atlassian.net/wiki/spaces/INT/pages/3577479175/Getting+started+with+the+Scott+Logic+blog
[sparse-checkout-guide]: https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/#sparse-checkout-and-partial-clones

[github-pages]: https://pages.github.com/
[github-pages-docs]: https://docs.github.com/en/pages
[run-docker]: #running-with-docker
[jekyll-docs]: https://jekyllrb.com/docs/
[kramdown-syntax]: https://kramdown.gettalong.org/syntax.html
[localhost]: http://localhost:4000
[ruby-github-pages]: https://rubygems.org/gems/github-pages
[ruby-bundler]: https://bundler.io/
[rubyinstaller]: https://rubyinstaller.org/
[ruby-installation-instructions]: https://www.ruby-lang.org/en/documentation/installation
[ruby-nokogiri]: https://nokogiri.org/
[ruby-liquid]: https://shopify.github.io/liquid/
[ruby-downloads]: https://www.ruby-lang.org/en/downloads/
[pa11y-ci]: https://github.com/pa11y/pa11y-ci
[project-gemfile]: ./Gemfile
[scottlogic-blog-repo]: https://github.com/ScottLogic/blog
