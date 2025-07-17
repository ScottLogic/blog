import scrapy
from .. import scraper_utils

class OldBlogSummariesSpider(scrapy.Spider):
    name = 'oldBlogSummaries'
    start_urls = [
        'http://smarter.scottlogic.com/careers',
        'http://smarter.scottlogic.com/insights'
    ]

    def parse(self, response):
        for post in response.css('div.post-item'):
            yield {
                'postPath': scraper_utils.post_path(post.css('div.post-header > h2 > a::attr("href")').extract_first()),
                'postSummary': post.css('div.post-body::text').extract()[1].strip()
            }
