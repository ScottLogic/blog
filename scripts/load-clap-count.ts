import jQuery from "jquery";

interface Clap {
  url: string;
  claps: number;
}

export function loadClapCount() {
  const elements = jQuery(".clap").toArray();
  const urls = elements.map(function (el) {
    return el.getAttribute("data-url");
  });

  jQuery
    .ajax({
      url: "https://ip2o6c571d.execute-api.eu-west-2.amazonaws.com/production/get-multiple",
      method: "POST",
      data: JSON.stringify(urls),
      headers: {
        "Content-Type": "text/plain",
      },
      contentType: "text/plain",
    })
    .done(function (claps: Clap[]) {
      jQuery(".clap").each(function () {
        const elem = jQuery(this);
        const urlAttribute = elem.attr("data-url");
        if (urlAttribute == null) {
          return;
        }
        const url = urlAttribute.replace(/^https?:\/\//, "");
        const clapCount = claps.find(function (c) {
          return c.url === url;
        });
        if (clapCount && clapCount.claps > 0) {
          elem
            .css("display", "initial")
            .find(".count")
            .html(clapCount.claps.toString());
        }
      });
    });
}
