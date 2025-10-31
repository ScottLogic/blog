require 'jekyll'
require "jekyll_plugin_logger"
require 'open3'
require 'benchmark'

module HookExec
    def convert_arg_to_h_entry(arg)
        case arg.class
        when Jekyll::Site.class
             {"site" => arg.to_liquid["site"] }
        when Hash.class
            {"payload" => arg}
        when Jekyll::Page.class
            arg.to_liquid
        when Jekyll::Document.class
            arg.to_liquid
        when Array.class
            {"files" => arg}
        else
            Jekyll.logger.warn("Hook Exec") { "Unknown argument type #{arg.class} for #{owner}.#{event} hook" }
        end
    end
    module_function :convert_arg_to_h_entry

    if Jekyll.configuration["hook_exec"]
        Jekyll.configuration["hook_exec"].each do |owner, events|
            events.each do |event, hooks|
                hooks.each do |name, hook|
                    raise "No command for hook_exec.#{owner}.#{event}.#{name}" unless hook['cmd']
                    cmd = Liquid::Template.parse(hook["cmd"])
                    env = hook["env"] ||= {}
                    env.transform_values! { |v| Liquid::Template.parse(v) }
                    priority = hook["priority"] ||= Jekyll::Hooks::DEFAULT_PRIORITY
                    logger = PluginMetaLogger.instance.new_logger(HookExec, PluginMetaLogger.instance.config)
                    log_prefix = "#{owner}.#{event}.#{name}"

                    Jekyll::Hooks.register(owner.to_sym, event.to_sym, priority: priority) do |*args|
                        arg_hash = args.collect(&HookExec.method(:convert_arg_to_h_entry)).reduce({}, :merge)
                        processed_env = env.transform_values {|v| v.render(arg_hash)}
                        processed_cmd = cmd.render(arg_hash)

                        time = Benchmark::realtime do
                            stdout, stderr, status = Open3.capture3(processed_env, "/bin/sh", "-c", processed_cmd)
                            logger.debug { "#{log_prefix} stdout:\n#{stdout}" }
                            unless status.success?
                                logger.error { "#{log_prefix} stderr: #{stderr}" }
                                raise "failed with status #{status.exitstatus}"
                            end
                        end

                        if time < 1.0
                            logger.debug {"#{log_prefix} took #{(time * 1000).round(2)}ms"}
                        else
                            logger.debug {"#{log_prefix} took #{time.round(2)}s"}
                        end
                    end
                    Jekyll.logger.info("HookExec") { "Registered #{owner}.#{event}.#{name} hook" }
                end
            end
        end
    else
        Jekyll.logger.debug("HookExec") { "No hook_exec config" }
    end
end