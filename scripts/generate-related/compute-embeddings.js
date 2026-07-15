const glob = require("glob-promise");
const fetch = require("node-fetch");
const fs = require("fs");
const { markdownToTxt } = require("markdown-to-txt");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const outputPath = './scripts/generate-related/data';
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
  
  const paths = await glob('./_posts/**/20{[1][3-9],[2][0-9]}-*.{md,markdown,html}').then((paths) => {
    return paths;
  });

  for (const path of paths) {
    const file = path.split("/").pop();
    const filename = `${outputPath}/${file}`;

    if (!fs.existsSync(filename)) {
      await summarisePost(formatContent(path), file).then((embedding) => {
        fs.writeFileSync(filename, JSON.stringify(embedding, null, 2));
      });
      await sleep(200);
    }
  }
})();

const formatContent = (post) => {
  const file = fs.readFileSync(post, "utf8");
  const body = file.split("---")[2];
  let text = markdownToTxt(body);
  text = text.replace(
    /\{% highlight [a-zA-Z]* %\}[\s\S]*\{% endhighlight %\}/g,
    " "
  );
  // remove whitespace and preserve ~2048 tokens (approx 1000 words)
  return text.split(/[\s]+/).slice(0, 1000).join(" ");
};

const summarisePost = async (data, file, retries = 5) => {
  const OPENAI_API_KEY = process.env.npm_config_openai_api_key;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        input: data,
        model: "text-embedding-ada-002",
      }),
    });

    if (res.status === 429) {
      const json = await res.json();
      if (json.error && json.error.code === "insufficient_quota") {
        throw Error("OpenAI quota exceeded - check your plan and billing details");
      }
      if (attempt < retries) {
        const retryAfter = res.headers.get("retry-after");
        const delay = retryAfter ? parseFloat(retryAfter) * 1000 : Math.pow(2, attempt + 2) * 1000;
        console.log(`rate limited on ${file}, retrying in ${Math.round(delay / 1000)}s...`);
        await sleep(delay);
        continue;
      }
    }

    if (res.status !== 200) {
      console.log("failed to embed: " + file);
      if (res.status === 401) {
        throw Error(res.statusText + " - check your OpenAI API key");
      }
      throw Error(res.statusText);
    }

    const json = await res.json();
    return json.data ? json.data[0].embedding : [];
  }
};
