const { execSync } = require("child_process");
const { logError, lintPost, getValidCategories } = require("./lintHelper");

const LINTER_MATCH_PATTERN = /^_posts.*\.(md|markdown|html)$/;

const lintCommit = () => {
    const categories = getValidCategories();
    
    const changedFiles = execSync("git diff --cached --name-only", {
        encoding: "utf-8",
    })
    .split("\n")
    .filter((file) => file.match(LINTER_MATCH_PATTERN));

    if (changedFiles.length === 0) {
        console.log("No relevant post files changed.");
        process.exit(0);
    }

    console.log("Linting posts to be committed:", changedFiles);

    let fail = false;

    for (const file of changedFiles) {
        if (!lintPost(file, categories))
        {
            fail = true;
        }
    }

    if (fail) {
        logError("Commit blocked due to linting errors.");
        process.exit(1);
    }
}

lintCommit()