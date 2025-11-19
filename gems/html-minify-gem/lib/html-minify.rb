require "jekyll"
require "jekyll_plugin_logger"
require "minify_html"
require "benchmark"

module HtmlMinify
    mode = ENV['JEKYLL_ENV'] || 'development'
    if mode == 'production'
        @logger = PluginMetaLogger.instance.new_logger(HtmlMinify, PluginMetaLogger.instance.config)
        @total_time = 0.0
        @count = 0
        @avg = 0

        Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
            if doc.output_ext != ".html"
                next
            end

            starting_size = doc.output.bytesize

            @total_time += Benchmark.realtime {
                doc.output = minify_html(doc.output, {
                    # Minify inline and "in document"
                    :minify_css => true,
                    :minify_js => true,
                    :keep_input_type_text_attr => true,
                    # Don't do noncompliant stuff
                    :allow_noncompliant_unquoted_attribute_values => false,
                    :allow_optimal_entities => false,
                    :allow_removing_space_between_attributes => false,
                    :minify_doctype => false
                })
            }

            ending_size = doc.output.bytesize
            diff_percent = ((starting_size - ending_size)/starting_size.to_f) * 100

            # Calculate average diff without having to storing all values or overflowing trivially
            @count += 1
            a = 1.0/@count
            @avg = a * diff_percent + (1-a) * @avg

            @logger.debug { "Minified #{doc.relative_path}: #{starting_size}B to #{ending_size}B #{diff_percent.round(2)}% reduction" }
        end

        Jekyll::Hooks.register :site, :post_render do |site|
            @logger.info { "Minified HTML in #{@total_time.round(2)}s with a #{@avg.round(2)}% average reduction" }
        end
    end
end