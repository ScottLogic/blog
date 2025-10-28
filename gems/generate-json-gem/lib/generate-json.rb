require 'json'
require 'jekyll'
require 'jekyll_plugin_support'
require_relative './version'

class JsonGenerator < JekyllSupport::JekyllGenerator
    VERSION = GenerateJson::VERSION

    def generate_impl
        @site.pages << Jekyll::PageWithoutAFile.new(@site, @site.source, '.', "/authors.json").tap do |file|
            author_counts = @site.posts.docs.flat_map { |post|
                # post is a Jekyll::Document https://github.com/jekyll/jekyll/blob/master/lib/jekyll/document.rb

                if post.data.has_key?("contributors")
                    if post.data["contributors"].is_a? Array
                        [post.data["author"]] + post.data["contributors"]
                    else
                        [post.data["author"], post.data["contributors"]]
                    end
                else
                    [post.data["author"]]
                end
            }.tally
            # Tally returns hash of { value: occurrences } for each value in iter
            author_counts.default = 0

            author_data = @site.site_data["authors"]["authors"].keys.to_h { |author|
                [author, { "post_count": author_counts[author] }]
            }

            file.content = author_data.to_json
            file.data.merge!("layout" => nil)
            file.output
        end
    end
end
