require 'jekyll'
require 'jekyll_plugin_support'
require 'open3'

class BundleJsPlugin < JekyllSupport::JekyllGenerator
    VERSION = "1.0.0".freeze

    def generate_impl
        stdout, stderr, status = Open3.capture3("node_modules/.bin/rspack", "build")

        @logger.debug { stdout }

        unless status.success?
            @logger.error { "Failed with error: #{stderr}" }
            raise "rspack failed with status #{status}"
        end
    end
end