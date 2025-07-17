function initialiseMenu() {
    jQuery(document).ready(function() {
      var $menu = jQuery('#mobileMenu').mmenu({});

      var $icon = jQuery('header .mobile-nav-trigger');
      var $closeinside = jQuery('.mm-listview .navbar-toggle');
      var API = $menu.data( 'mmenu' );

      $icon.on( 'click', function() {
          API.open();
      });
      $closeinside.on('click', function () {
          API.close();
      });
      API.bind( 'open:finish', function() {
          $icon.removeClass( 'collapsed' );
      });
      API.bind( 'close:finish', function() {
          $icon.addClass( 'collapsed' );
          jQuery('#nav-icon').removeClass('open');
      });

      jQuery('#nav-icon').click(function(){
          jQuery(this).toggleClass('open');
      });
  });
}