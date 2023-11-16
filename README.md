# Scott Logic Blogs

See the [confluence page for user instructions][confluence-getting-started], 
and use the [blog tool][blog-tool-endpoint] for an easy way to publish blog posts.

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

```bash
# see comment above about configuring SSH, and modify the clone URL accordingly to use the correct SSH identity
# you may also consider forking the blog repository, and cloning your personal fork instead
git clone --depth 1 --filter=blob:none --no-checkout git@github.com:ScottLogic/blog.git
cd blog
git sparse-checkout init --cone
# modify this variable with the author name you wish to write posts under (typically derived from your SL email address)
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

_In theory_, given that you've installed Ruby and Bundler, 
and that the project contains a valid [Gemfile][project-gemfile],
then using Bundler should bring in most of the dependencies automatically,
however, due to Nokogiri's reliance on Native XML parsers you may require additional steps.

### Docker:

Use a bash-compatible shell.

**Install gem dependencies**

First, output gem dependencies to a directory `container_gem_cache` on our host machine:

```bash
./shell/docker-gem-install.sh
```

**Run dev watch**

Now we can serve the blog:

```bash
BLOG_USERNAME=abirch ./shell/docker-dev-watch.sh
```

Visit the blog at:  
http://localhost:4000

### Linux:

1. sudo apt-get install ruby2.3 ruby2.3-dev build-essential dh-autoreconf
2. sudo gem update
3. sudo gem install jekyll bundler
4. Run 'jekyll -v' to check whether Jekyll is working
5. bundle config path vendor/bundle
6. gem install bundler
7. sudo apt-get install libxslt-dev libxml2-dev zlib1g-dev
8. sudo gem install nokogiri
9. bundle install
10. bundle exec jekyll serve
11. Uncomment the lines in \_config.yml
12. Access on http://localhost:4000

## Additional Tasks:

To minify JS, run:
```
npm run scripts
```

To minify SCSS, run:
```
npm run style
```

[confluence-getting-started]: https://scottlogic.atlassian.net/wiki/spaces/INT/pages/3577479175/Getting+started+with+the+Scott+Logic+blog
[blog-tool-endpoint]: https://cz90l8ad7e.execute-api.eu-west-2.amazonaws.com/production/
[sparse-checkout-guide]: https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/#sparse-checkout-and-partial-clones
[github-ssh]: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
[github-ssh-multiple-accounts]: https://gist.github.com/oanhnn/80a89405ab9023894df7

[github-pages]: https://pages.github.com/
[github-pages-docs]: https://docs.github.com/en/pages
[jekyll-docs]: https://jekyllrb.com/docs/
[kramdown-syntax]: https://kramdown.gettalong.org/syntax.html
[ruby-github-pages]: https://rubygems.org/gems/github-pages
[ruby-bundler]: https://bundler.io/
[ruby-nokogiri]: https://nokogiri.org/
[ruby-liquid]: https://shopify.github.io/liquid/
[ruby-downloads]: https://www.ruby-lang.org/en/downloads/
[project-gemfile]: Gemfile
[install-docker]: #docker