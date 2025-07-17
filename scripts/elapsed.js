function makeTimestampsRelative() {
  jQuery('.timestamp').each(function() {
    var elem = jQuery(this),
      dateString = elem.attr('date-published'),
    	dateOnlyString = dateString.slice(0, 10),
      thenUTCSeconds = Math.floor(Date.parse(dateOnlyString) / 1000),
      nowUTCSeconds = Math.floor(Date.now() / 1000),
      diffAsDays = Math.floor((nowUTCSeconds - thenUTCSeconds) / 86400),
      diffAsWeeks = Math.floor(diffAsDays / 7),
      daysUnitLabel = (diffAsDays === 1) ? 'day' : 'days',
      weeksUnitLabel = (diffAsWeeks === 1) ? 'week' : 'weeks';

    if (!isNaN(thenUTCSeconds)) {
      if (diffAsDays < 7) {
          elem.empty().html(
            (diffAsDays === 0) ? 'today' : [diffAsDays, daysUnitLabel, 'ago'].join(' ')
          );
      } else if (diffAsWeeks < 4) {
        elem.empty().html([diffAsWeeks, weeksUnitLabel, 'ago'].join(' '));
      }
    }
  });
}
makeTimestampsRelative();