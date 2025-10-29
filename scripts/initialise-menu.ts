import jQuery from "jquery";

export function initialiseMenu() {
  jQuery(function () {
    // Don't know if our version of mmenu is different to the one in npm, so
    // gonna keep it and hope it continues to work
    // @ts-expect-error
    const $menu = jQuery("#mobileMenu").mmenu({});

    const $icon = jQuery("header .mobile-nav-trigger");
    const $closeinside = jQuery(".mm-listview .navbar-toggle");
    const API = $menu.data("mmenu");

    $icon.on("click", function () {
      API.open();
    });
    $closeinside.on("click", function () {
      API.close();
    });
    API.bind("open:finish", function () {
      $icon.removeClass("collapsed");
    });
    API.bind("close:finish", function () {
      $icon.addClass("collapsed");
      jQuery("#nav-icon").removeClass("open");
    });

    jQuery("#nav-icon").on("click", function () {
      jQuery(this).toggleClass("open");
    });
  });
}
