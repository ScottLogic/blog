require 'json'
require 'benchmark'

module GenerateJson
    def generate(site)
        author_counts = site.posts.docs.flat_map { |post|
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

        author_data = site.site_data["authors"]["authors"].keys.to_h {|author|
            [author, {"post_count": author_counts[author]}]
        }

        File.write("#{site.dest}/authors.json", author_data.to_json)
    end
    module_function :generate
end

Jekyll::Hooks.register(:site, :post_write) do |site|
    time = Benchmark.realtime {
        GenerateJson.generate(site)
    }

    puts "Generate JSON: ".rjust(20) + "Took #{(time * 1000.0).round(4)}ms"
end
