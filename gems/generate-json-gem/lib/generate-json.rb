require 'json'
require 'jekyll'
require 'jekyll_plugin_support'
require_relative './version'

class JsonGenerator < JekyllSupport::JekyllGenerator
    VERSION = GenerateJson::VERSION

    def generate_impl
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

        author_data = @site.site_data["authors"]["authors"].keys.to_h {|author|
            [author, {"post_count": author_counts[author]}]
        }

        file = "authors.json"
        out_file = "#{@site.dest}/#{file}"
        bytes = File.write(out_file, author_data.to_json)
        @logger.info { "Wrote #{bytes}B to #{out_file}" }

        if File.file?(out_file)
            # args 2, 3 and 4 get concated to build the full file path
            @site.static_files << Jekyll::StaticFile.new(@site, @site.dest, "", file)
        end
    end
end
