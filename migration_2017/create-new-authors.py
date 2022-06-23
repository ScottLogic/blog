import os
import csv
import yaml

def create_author(user_name, full_name, email, summary, current_authors):
    author_directory = '../%s' % user_name
    os.makedirs(author_directory)
    with open('%s/index.html' % author_directory, 'w') as index_file:
        index_file.writelines([
            '---\n',
            'author: %s\n' % user_name,
            'title: %s\n' % full_name,
            'layout: default_author\n',
            '---\n'
        ])
    with open('%s/atom.xml' % author_directory, 'w') as atom_file:
        atom_file.writelines([
            '---\n',
            'author: %s\n' % user_name,
            'layout: atom_feed\n',
            '---\n'
        ])
    with open('%s/feed.xml' % author_directory, 'w') as feed_file:
        feed_file.writelines([
            '---\n',
            'author: %s\n' % user_name,
            'layout: rss_feed\n',
            '---\n'
        ])
    current_authors['active-authors'].append(user_name)
    current_authors['authors'][user_name] = {
        'name': full_name,
        'email': email,
        'author-summary': summary
    }

with open('input/new-authors.csv', newline='') as to_create_csv:
    current_authors = yaml.load(open('../_data/authors.yml'))
    authors_to_create = csv.reader(to_create_csv)
    next(authors_to_create, None)  # skip the headers
    for user_name, full_name, email, summary in authors_to_create:
        create_author(user_name, full_name, email, summary, current_authors)
    current_authors['active-authors'] = sorted(current_authors['active-authors'])
    yaml.dump(current_authors, open('../_data/authors.yml', 'w'),
              default_flow_style=False,
              indent=4)
