import json
import os
import datetime
import yaml

def inspect_content(post):
    if ("smarter.scottlogic.com/hs-fs" in post['content'] or
            "smarter.scottlogic.com/hubfs" in post['content']):
        print('Post with hubspot asset: %s %s' % (post['publishDate'], post['title']))

for post in json.load(open('old_blog_contents.json')):
    inspect_content(post)
    posts_directory = '../%s/_posts' % post['author']
    if not os.path.exists(posts_directory):
        os.makedirs(posts_directory)

    publishDate = datetime.datetime.strptime(post['publishDate'], '%Y-%m-%d %H:%M')
    post_file_path = '%s/%s-%s.html' % (posts_directory, publishDate.strftime('%Y-%m-%d'), post['slug'])
    with open(post_file_path, 'w', encoding='utf8') as post_file:
        post_file.write('---\n')
        yaml.dump({
            'published': 'true',
            'author': post['author'],
            'title': post['title'],
            'date': post['publishDate'],
            'layout': 'default_post',
            'categories': post['category'],
            'summary': post['summary']
        }, post_file, allow_unicode=True, default_flow_style=False)
        post_file.write('---\n\n%s\n' % post['content'])
