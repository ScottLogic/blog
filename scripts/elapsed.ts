import jQuery from "jquery";

export function makeTimestampsRelative() {
  jQuery(".timestamp").each(function () {
    const elem = jQuery(this);
    const dateString = elem.attr("date-published");
    if (dateString == null) {
      return;
    }
    const dateOnlyString = dateString.slice(0, 10);
    const thenUTCSeconds = Math.floor(Date.parse(dateOnlyString) / 1000);
    const nowUTCSeconds = Math.floor(Date.now() / 1000);
    const diffAsDays = Math.floor((nowUTCSeconds - thenUTCSeconds) / 86400);
    const diffAsWeeks = Math.floor(diffAsDays / 7);
    const daysUnitLabel = diffAsDays === 1 ? "day" : "days";
    const weeksUnitLabel = diffAsWeeks === 1 ? "week" : "weeks";

    if (!isNaN(thenUTCSeconds)) {
      if (diffAsDays < 7) {
        elem
          .empty()
          .html(
            diffAsDays === 0
              ? "today"
              : [diffAsDays, daysUnitLabel, "ago"].join(" "),
          );
      } else if (diffAsWeeks < 4) {
        elem.empty().html([diffAsWeeks, weeksUnitLabel, "ago"].join(" "));
      }
    }
  });
}
