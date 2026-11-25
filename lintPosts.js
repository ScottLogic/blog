const globby = require("globby");
const yaml = require("js-yaml");
const fs = require("fs");
const { logError, getValidCategories, lintPost } = require("./lintHelper");

const LINTER_MATCH_PATTERN="_posts/**/*.{md,markdown,html}";

const lintAuthorsYml = () => {
  const authorsPath = "_data/authors.yml";
  let authorsYaml = "";

  try {
    authorsYaml = yaml.safeLoad(fs.readFileSync(authorsPath, "utf8"));
  } catch (e) {
    logError(authorsPath, e["message"]);
    process.exit(1);
  }

  const activeAuthors = authorsYaml["active-authors"];

  // lint authors.yml
  if (new Set(activeAuthors).size !== activeAuthors.length) {
    activeAuthors.sort();

    let err_message =
      "Following author(s) duplicated in the active author list:\n";
    let duplicates = new Set();

    for (i = 1; i < activeAuthors.length; i++) {
      if (
        activeAuthors[i] === activeAuthors[i - 1] &&
        !duplicates.has(activeAuthors[i])
      ) {
        err_message += activeAuthors[i] + "\n";
        duplicates.add(activeAuthors[i]);
      }
    }

    logError(err_message);
    process.exit(1);
  }
};

const lintPosts = () => {
  const categories = getValidCategories();

  let fail = false;

  // lint each blog post
  globby([LINTER_MATCH_PATTERN]).then(paths => {
    paths.forEach(path => {
      if (!lintPost(path, categories))
      {
        fail = true;
      }
    });

    if (fail) {
      process.exit(1);
    } else {
      console.log(paths.length + " files passed the linting check");
    }
  });
};

lintAuthorsYml();
lintPosts();
