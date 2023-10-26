const glob = require("glob-promise");
const fetch = require("node-fetch");
const fs = require("fs");
const { markdownToTxt } = require("markdown-to-txt");


(async () => {
  const outputPath = './scripts/generate-related/data';
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
  
  const paths = await glob('./_posts/**/20{[1][3-9],[2][0-3]}-*.{md,markdown,html}').then((paths) => {
    return paths;
  });

  for (const path of paths) {
    const file = path.split("/").pop();
    const filename = `${outputPath}/${file}`;

    if (!fs.existsSync(filename)) {
      await summarisePost(formatContent(path), file).then((embedding) => {
        fs.writeFileSync(filename, JSON.stringify(embedding, null, 2));
      });
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

const summarisePost = async (data, file) => {
  const OPENAI_API_KEY = process.env.npm_config_openai_api_key;

  return await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        input: data,
        model: "text-embedding-ada-002"
      }),
    })
    .then((res) => {
      if(res.status !== 200) {
        console.log("failed to embed: " +  file)
        if(res.status === 401) {
          throw Error(res.statusText + " - check your OpenAI API key");
        }
        throw Error(res.statusText);
      }
      return res.json()
    })
    .then((json) => {
      if (json.data) {
        return json.data[0].embedding;
      } else {
        return [];
      }
    });
};
