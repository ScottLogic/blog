const globby = require("globby");
const matter = require("gray-matter");
const yaml = require("js-yaml");
const fs = require("fs");

const flatMap = (arr, mapFunc) =>
  arr.reduce((prev, x) => prev.concat(mapFunc(x)), []);

const lintAuthorsYml = () => {
  const authorsPath = "_data/authors.yml";
  let authorsYaml = "";

  try {
    authorsYaml = yaml.safeLoad(fs.readFileSync(authorsPath, "utf8"));
  } catch (e) {
    console.error(authorsPath, e["message"]);
    process.exit(1);
  }

  const activeAuthors = authorsYaml["active-authors"];

  // lint authors.yml
  if (new Set(activeAuthors).size !== activeAuthors.length) {
    activeAuthors.sort();

    let err_message =
      "Following author(s) duplicated in the active author list:\n";
    let dups = new Set();

    for (i = 1; i < activeAuthors.length; i++) {
      if (
        activeAuthors[i] === activeAuthors[i - 1] &&
        !dups.has(activeAuthors[i])
      ) {
        err_message += activeAuthors[i] + "\n";
        dups.add(activeAuthors[i]);
      }
    }

    console.error(err_message);
    process.exit(1);
  }
};

const lintPosts = () => {
  const categoriesYaml = yaml.safeLoad(
    fs.readFileSync("_data/categories.yml", "utf8")
  );

  const categories = flatMap(
    // remove 'Latest Articles' which is a pseudoe-category
    categoriesYaml.filter(c => c.url.startsWith("/category/")),
    // merge category title into sub-categories
    c => [c.title].concat(c.subcategories ? c.subcategories : [])
  ).map(c => c.toLowerCase());

  let fail = false;

  // lint each blog post
  globby(["*/_posts/**/*.{md,html}"]).then(paths => {
    paths.forEach(path => {
      try {
        const blogPost = fs.readFileSync(path, "utf8");
        const frontMatter = matter(blogPost);

        let category;
        // if the frontmatter defines a 'category' field:
        if (frontMatter.data.category) {
          category = frontMatter.data.category.toLowerCase();
        // if the frontmatter defines a 'categories' field with a single value:
        } else if ( frontMatter.data.categories && frontMatter.data.categories.length === 1 ) {
          category = frontMatter.data.categories[0].toLowerCase();
        } else {
          console.error("The post " + path + " does not have a single category defined");
          fail = true;
          return;
        }

        if (!categories.includes(category)) {
          console.error(
            "The post " + path + " does not have a recognised category"
          );
          fail = true;
        }

        const summary = frontMatter.data.summary;
        const postDateString = path.split("/")[2].substring(0, 10);
        const postDate = new Date(postDateString);
        if (postDate > new Date("2018-03-26")) {
          // Note _prose.yml specifies 130 characters are needed, so if you change this please also change the instructions
          if (!summary || summary.length < 130) {
            console.error(
              "The post " + path + " does not have a summary of > 130 characters"
            );
            fail = true;
          }
        }
      } catch (e) {
        console.error(path, e);
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
