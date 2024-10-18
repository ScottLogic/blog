# Scott Logic Blogs

See below for technical details of the blog creation stack and, 
e.g., instructions on how to install and run the blog site locally.

Note that if you're looking to **author a blog post**, then you don't need to read any further!
Instead, please see our [company extranet][confluence-getting-started]
for instructions on how to create a new page and view it before publication on the blog.

## Technical Stack

The blog is a static website, designed to be hosted on [GitHub pages][github-pages].

The underlying content is generated through a series of Ruby gems and libraries, starting with a dedicated github-pages [gem][ruby-github-pages].

Within that stack, [Jekyll][jekyll-docs] is used as the static content generation engine,
consuming template files written in either **HTML** or **Markdown** (syntax extended by [Kramdown][kramdown-syntax]).

Common content or structure can be further injected or managed using the [Liquid][ruby-liquid] templating language.

## Cloning the repository

_[Sparse checkout][sparse-checkout-guide] requires Git 2.25.0_

_Ensure that that your [SSH configuration][github-ssh] will also let you connect to [private GitHub repositories][github-ssh-multiple-accounts]._

If you wish to develop changes to the blog locally, you may find that there's a lot of content, and prefer just to download the bits you need.

```shell
# see comment above about configuring SSH, and modify the clone URL accordingly to use the correct SSH identity
# you may also consider forking the blog repository, and cloning your personal fork instead
git clone --depth 1 --filter=blob:none --no-checkout git@github.com:ScottLogic/blog.git
cd blog
git sparse-checkout init --cone
# if you want to write blog posts, modify this variable with the author name you
# wish to write posts under (typically derived from your SL email address)
AUTHOR='abirch'
git sparse-checkout set _includes _layouts _data category scripts scss assets "$AUTHOR"
git checkout gh-pages
```

This gets the repository down to ~8MB and ~150 files (whereas checking out all authors' posts would take hundreds of megabytes).

## Run local copy of blog (for blog devs only)

__NOTE__: Instructions are work in progress.

If you plan to use Docker, then you can [skip ahead][install-docker] now!

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

### Native environment

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

On Windows, in a PowerShell instance with elevated priveleges:

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

If you need to re-compile the scripts or SCSS, you can use the NPM scripts.

```shell
npm ci
npm run scripts
npm run style
```

### Docker

Use a bash-compatible shell; Git bash on Windows should work fine.

**Install gem dependencies**

First, we output gem dependencies to directory `container_gem_cache` on the host machine:

```shell
./shell/docker-gem-install.sh
```

**Run dev watch**

Now we can serve the blog with live reloading. Replace "jbloggs" with your ScottLogic username:

```shell
BLOG_USERNAME=jbloggs ./shell/docker-dev-watch.sh
```

It'll take a while to build first time (up to 5 minutes), and you'll likely see a fair few warnings in the terminal for
older posts, but once it's done you should see message "done in XXX.YYY seconds".

Navigate to [localhost][localhost] in your browser.

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
[github-ssh]: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
[github-ssh-multiple-accounts]: https://gist.github.com/oanhnn/80a89405ab9023894df7

[github-pages]: https://pages.github.com/
[github-pages-docs]: https://docs.github.com/en/pages
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
[project-gemfile]: Gemfile
[install-docker]: #docker

