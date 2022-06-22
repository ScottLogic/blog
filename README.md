## Scott Logic Blogs

See the [confluence page for user instructions](https://scottlogic.atlassian.net/wiki/spaces/INT/pages/219054172/Blog+Publishing), and use the [blog tool](https://cz90l8ad7e.execute-api.eu-west-2.amazonaws.com/production/) for an easy way to publish blog posts 

## Cloning the repository

_[Sparse checkout](https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/#sparse-checkout-and-partial-clones) requires Git 2.25.0_

_Ensure that you have [configured SSH](https://gist.github.com/oanhnn/80a89405ab9023894df7) to connect to private GitHub repositories._

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

The blog consists of static HTML pages with content generated using Jekyll markdown.

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

To minify JS, run:
```
npm run scripts
```


To minify SCSS, run:
```
npm run style
```


