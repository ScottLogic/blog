import scrapy
import csv
import json
from .. import scraper_utils
from urllib.parse import urlparse

class OldBlogContentsSpider(scrapy.Spider):
    name = 'oldBlogContents'

    def __init__(self, *args, **kwargs):
        super(OldBlogContentsSpider, self).__init__(*args, **kwargs)
        self.summaries_by_path = { post['postPath']: post['postSummary'] for post in json.load(open('old_blog_summaries.json')) }

    def start_requests(self):
        with open('input/posts-to-migrate.csv', newline='') as to_migrate_csv:
            to_migrate_reader = csv.reader(to_migrate_csv)
            next(to_migrate_reader, None)  # skip the headers
            for row in to_migrate_reader:
                yield scrapy.Request(url=row[0], meta={'publishDate': row[1], 'category': row[2], 'author': row[3]})

    def parse(self, response):
        yield {
            'publishDate': response.meta['publishDate'],
            'category': response.meta['category'],
            'author': response.meta['author'],
            'title': response.css('.post-header > h1 > span::text').extract_first(),
            'slug': scraper_utils.post_slug(response.url),
            'summary': self.summaries_by_path[scraper_utils.post_path(response.url)],
            'content': ''.join(response.css('.post-content > span > *').extract())
        }
