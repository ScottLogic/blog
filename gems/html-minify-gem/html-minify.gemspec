require_relative "lib/version"

Gem::Specification.new do |spec|
    spec.name = "html-minify"
    spec.version = HtmlMinify::VERSION
    spec.summary = "Minify HTML hook for Scott Logic blog"
    spec.authors = ["Stuart Reilly"]
    spec.email = "sreilly@scottlogic.com"

    spec.files = Dir["lib/**/*"]
    spec.require_paths = ["lib"]

    spec.required_ruby_version = ">= 3"

    spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
    spec.add_dependency "minify_html"
    spec.add_dependency "jekyll_plugin_logger"
    spec.add_dependency "benchmark"
end