const { execSync } = require("child_process");
const { logError, lintPost, getValidCategories } = require("./lintHelper");
const readline = require("readline")

const LINTER_MATCH_PATTERN = /^_posts.*\.(md|markdown|html)$/;
const EMPTY_OBJECT_PATTERN = /^0+$/;

const getChangedFiles = async () => {
    const rl = readline.createInterface({input: process.stdin, crlfDelay: Infinity});

    const ranges = [];

    for await (const line of rl) {
        const [_localRef, localSha, _remoteRef, remoteSha] = line.trim().split(/\s+/);

        if (!localSha || localSha.match(EMPTY_OBJECT_PATTERN)) {
            continue; // branch deleted, ignore
        }

        if (!remoteSha || remoteSha.match(EMPTY_OBJECT_PATTERN)) {
            // new branch
            ranges.push(localSha);
        } else {
            ranges.push(`${remoteSha}..${localSha}`);
        }
    }
    if (ranges.length === 0) {
        return [];
    }

    let files = [];
    for (const range of ranges) {
        try {
            const diffOutput = execSync(
                `git diff --name-only ${range}`,
                { encoding: "utf8" }
            );
            files.push(...diffOutput.split("\n").filter(file => file.match(LINTER_MATCH_PATTERN)));
        } catch {
            // ignore empty diffs
        }
    }

    return new Set(files);
}

const lintOnPush = async () => {
    const categories = getValidCategories();
    
    const changedFiles = await getChangedFiles();

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

lintOnPush().then(() => {
    console.log("Linting completed successfully");
    process.exit(1);
}).catch((err) => {
  console.error("Unexpected error in pre-push hook:", err);
  process.exit(1);
});