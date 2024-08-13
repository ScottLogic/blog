function loadClapCount() {
    var elements = jQuery(".clap").toArray();
    var urls = elements.map(function(el) {
        return el.getAttribute("data-url");
    });
    jQuery.ajax({
        url: "https://ip2o6c571d.execute-api.eu-west-2.amazonaws.com/production/get-multiple",
        method: "POST",
        data: JSON.stringify(urls),
        headers: {
            "Content-Type": "text/plain"
        },
        contentType: "text/plain"
    }).done(function(claps) {
        jQuery(".clap").each(function() {
            var elem = jQuery(this),
                url = elem.attr("data-url").replace(/^https?:\/\//, "");
            var clapCount = claps.find(function(c) { return c.url === url; });
            if (clapCount && clapCount.claps > 0) {
                elem.css("display", "initial")
                    .find(".count")
                    .html(clapCount.claps);
            }
        });
    });
}