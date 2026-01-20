// defined in default.html
declare const IS_PAGINATED: boolean;

import $ from "jquery";
$.noConflict();

import jQuery from "jquery";
import { initialiseMenu } from "./initialise-menu";
import { loadClapCount } from "./load-clap-count";
import { makeTimestampsRelative } from "./elapsed";

jQuery(() => {
  initialiseMenu();
  loadClapCount();
  makeTimestampsRelative();

  if (IS_PAGINATED) {
    // @ts-ignore
    jQuery(".content").jscroll({
      contentSelector: ".content",
      nextSelector: ".next",
      loadingHtml:
        '<div id="loadingSpinner"><div class="f_circleG" id="frotateG_01"></div><div class="f_circleG" id="frotateG_02"></div><div class="f_circleG" id="frotateG_03"></div><div class="f_circleG" id="frotateG_04"></div><div class="f_circleG" id="frotateG_05"></div><div class="f_circleG" id="frotateG_06"></div><div class="f_circleG" id="frotateG_07"></div><div class="f_circleG" id="frotateG_08"></div></div>',
      callback: function () {
        makeTimestampsRelative();
        loadClapCount();
      },
    });
  }
});
