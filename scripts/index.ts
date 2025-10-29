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
});
