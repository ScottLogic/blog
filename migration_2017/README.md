#### Usage

First, create the author directories for new authors (uses the `input/new-authors.csv` file):
```
python create-new-authors.py
```

[Scrapy](https://scrapy.org/) needs to be installed.

Scrape the summaries of the blog posts from the careers and insights blogs:
```
scrapy crawl oldBlogSummaries -o old_blog_summaries.json
```

Scrape the contents of the blog posts (uses `input/posts-to-migrate.csv`, collects the data into `old_blog_contents.json`):
```
scrapy crawl oldBlogContents -o old_blog_contents.json
```

Create the new blog posts (uses `old_blog_contents.json`):
```
python new-posts-from-old.py
```

This script will print the titles of posts to the console that contain assets from the old hubspot system.
There is no script to copy these programmatically but this info can be used to update the assets manually.
