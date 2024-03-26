require 'nokogiri'

Jekyll::Hooks.register :documents, :post_render do |document|
  Jekyll.logger.debug "Making code blocks keyboard focusable in #{document.relative_path}..."
  count_code_blocks = 0

  html = Nokogiri.HTML5(document.output)
  html.css('pre').each do |pre|
    pre['tabindex'] = '0' unless pre.has_attribute?('tabindex')
    count_code_blocks += 1
  end

  document.output = html.to_html
  if count_code_blocks > 0 then
    Jekyll.logger.info "Made #{count_code_blocks} code blocks keyboard focusable in #{document.relative_path}."
  else
    Jekyll.logger.debug "Made #{count_code_blocks} code blocks keyboard focusable in #{document.relative_path}."
  end
end

