import $ from "jquery";
$.noConflict();

import jQuery from "jquery";
import { initialiseMenu } from "./initialise-menu";
import { loadClapCount } from "./load-clap-count";
import { makeTimestampsRelative } from "./elapsed";
import { loadAuthorList } from "./post_counts";

jQuery(() => {
  initialiseMenu();
  loadClapCount();
  makeTimestampsRelative();
  loadAuthorList();
});
