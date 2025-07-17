const globby = require("globby");
const matter = require("gray-matter");
const yaml = require("js-yaml");
const fs = require("fs");
const clc = require("cli-color");
const LINTER_MATCH_PATTERN="_posts/**/*.{md,markdown,html}";
const MAX_CATEGORIES = 3;

const errorColour = clc.red.bold;
const warningColour = clc.yellow;

const logError = (...params) =>
  console.error(errorColour(...params));

const logWarning = (...params) =>
  console.warn(warningColour(...params));

const flatMap = (arr, mapFunc) =>
  arr.reduce((prev, x) => prev.concat(mapFunc(x)), []);

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
  const categoriesYaml = yaml.safeLoad(
    fs.readFileSync("_data/categories.yml", "utf8")
  );

  const categories = flatMap(
    // remove 'Latest Articles' which is a pseudo-category
    categoriesYaml.filter(c => c.url.startsWith("/category/")),
    // merge category title into sub-categories
    c => [c.title].concat(c.subcategories ? c.subcategories : [])
  ).map(c => c.toLowerCase());

  console.log("Valid categories are: " + categories.join(', '));

  let fail = false;

  // lint each blog post
  globby([LINTER_MATCH_PATTERN]).then(paths => {
    paths.forEach(path => {
      try {
        const blogPost = fs.readFileSync(path, "utf8");
        const frontMatter = matter(blogPost);
        const frontMatterCats = frontMatter.data.categories;

        let category;
        let postCategories;
        // if the frontmatter defines a 'category' field:
        if (frontMatter.data.category) {
          category = frontMatter.data.category.toLowerCase();
          postCategories = [category];
        // if the frontmatter defines a 'categories' field with at least one but no more than 3 values:

        } else if (frontMatterCats && frontMatterCats.length && frontMatterCats.length <= MAX_CATEGORIES) {
          postCategories = frontMatter.data.categories.map(c => c.toLowerCase());
          category = postCategories[0];
        } else {
          logError("The post " + path + " does not have at least one and no more than " + MAX_CATEGORIES + " categories defined.");
          fail = true;
          return;
        }

        if (!categories.includes(category)) {
          logError(
            "The post " + path + " does not have a recognised category"
          );
          fail = true;
        } else {
          postCategories
            .filter(c => !categories.includes(c))
            .forEach(c => logWarning(
              "The post " + path + " has an unrecognised category: '" + c + "'. Check spelling or remove/move to tags."
            ));
        }


        const summary = frontMatter.data.summary;
        const pathArray = path.split("/");
        const postDateString = pathArray[pathArray.length - 1].substring(0, 10);
        const postDate = new Date(postDateString);
        if (postDate > new Date("2018-03-26")) {
          // Note _prose.yml specifies 130 characters are needed, so if you change this please also change the instructions
          if(!summary) {
              logError("The post " + path + " does not have a summary.")
              fail = true;
          }
          else if (summary.length < 130) {
            logWarning(
              "The post " + path + " summary length is " + summary.length + ". Recommended minimum length for the summary is 130 characters."
            );
          }
        }
      } catch (e) {
        logError(path, e);
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
