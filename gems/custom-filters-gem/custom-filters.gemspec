require_relative "lib/version"

Gem::Specification.new do |spec|
    spec.name = "custom-filters"
    spec.version = CustomFilters::VERSION
    spec.summary = "Custom filters for Scott Logic blog"
    spec.authors = ["Stuart Reilly"]
    spec.email = "sreilly@scottlogic.com"

    spec.files = Dir["lib/**/*"]
    spec.require_paths = ["lib"]

    spec.required_ruby_version = ">= 3"

    spec.add_dependency "jekyll", ">= 3.7", "< 5.0"
end