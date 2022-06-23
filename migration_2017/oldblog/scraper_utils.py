from urllib.parse import urlparse

def post_path(url):
    return '/' + '/'.join(urlparse(url).path.split('/')[-2:])

def post_slug(url):
    return urlparse(url).path.split('/')[-1]
