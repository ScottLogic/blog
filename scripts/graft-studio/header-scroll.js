
jQuery('.tab-nav').each(function(){
    var $active, $content, $links = jQuery(this).find('a');
    $active = jQuery($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
    $active.addClass('active');
    $content = jQuery($active[0].hash);
    $links.not($active).each(function () {
        jQuery(this.hash).hide();
    });
    jQuery(this).on('click', 'a', function(e){
        $active.removeClass('active');
        $content.hide();
        $active = jQuery(this);
        $content = jQuery(this.hash);
        $active.addClass('active');
        $content.show();
        e.preventDefault();
    });
});

jQuery('.events-cta a').click(function(e){
    e.preventDefault();
    jQuery('.past-events').slideToggle();
});

jQuery(window).scroll(function(){
    if (jQuery(window).scrollTop() >= 1) {
        jQuery('header').addClass('fixed-header');
    }
    else {
        jQuery('header').removeClass('fixed-header');
    }
});

