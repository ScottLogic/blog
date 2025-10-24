module CustomFilters
    def starts_with(input, start)
        input&.start_with?(start) || false
    end

    def ends_with(input, ending)
        input&.end_with?(ending) || false
    end
end

Liquid::Template.register_filter(CustomFilters)