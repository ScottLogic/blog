const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { default: axios } = require("axios");
require("dotenv").config();
const { execSync } = require("child_process");

const API_ENDPOINT_PRODUCTION =
  process.env.BLOG_POSTS_DEPLOY_TO_ALGOLIA_ENDPOINT_PRODUCTION;
const API_ENDPOINT_DEVELOP =
  process.env.BLOG_POSTS_DEPLOY_TO_ALGOLIA_ENDPOINT_DEVELOP;

function transformFileNameFormat(str) {
  // Split the string into parts
  const parts = str.split("-");

  // Join the first three parts with a slash and then the rest with a dash
  const transformedString = `${parts[0]}/${parts[1]}/${parts[2]}/${parts
    .slice(3)
    .join("-")}`;

  return transformedString;
}

function removeHtmlTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

// Function to extract metadata from a file using 'gray-matter'
const extractMetadata = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  return {
    title: parsed.data.title,
    url: `/${transformFileNameFormat(path.basename(filePath, ".md"))}`,
    description: removeHtmlTags(parsed.data.summary),
    isBlog: true,
    id: parsed.data.id,
  }; // This will contain the frontmatter (metadata) such as title, description, etc.
};

// Function to extract metadata from the previous version of a file (from the last commit)
const extractPreviousMetadata = (filePath) => {
  try {
    const previousContent = execSync(`git show HEAD^:${filePath}`, {
      encoding: "utf-8",
    });
    const parsed = matter(previousContent);
    return {
      title: parsed.data.title,
      url: `/${transformFileNameFormat(path.basename(filePath, ".md"))}`,
      description: removeHtmlTags(parsed.data.summary),
      isBlog: true,
      id: parsed.data.id,
    };
  } catch (error) {
    console.error(
      `Error extracting previous metadata for ${filePath}: ${error}`
    );
    return null;
  }
};

async function sendBlogsToAlgolia() {
  // Get arguments passed from the GitHub Action (new, modified, deleted files)
  const newFiles = process.argv[2].split(" ");
  const modifiedFiles = process.argv[3].split(" ");
  const deletedFiles = process.argv[4].split(" ");

  // Arrays to store the metadata from new and modified files
  // These will be sent to the endpoint
  const newFilesData = [];
  const modifiedFilesData = [];
  const deletedFilesData = [];

  // Process new files
  newFiles.forEach((file) => {
    if (file && fs.existsSync(file)) {
      const metadata = extractMetadata(file);
      newFilesData.push({ file, ...metadata });
    }
  });

  // Process modified files (both before and after modification)
  modifiedFiles.forEach((file) => {
    if (file && fs.existsSync(file)) {
      const previousMetadata = extractPreviousMetadata(file);
      const currentMetadata = extractMetadata(file);
      modifiedFilesData.push({
        previous: previousMetadata,
        current: currentMetadata,
      });
    }
  });

  // Process deleted files
  deletedFiles.forEach((file) => {
    if (file && fs.existsSync(file)) {
      const metadata = extractMetadata(file);
      deletedFilesData.push({ ...metadata });
    }
  });

  try {
    if (!API_ENDPOINT_PRODUCTION || !API_ENDPOINT_DEVELOP) {
      throw new Error(
        "BLOG_POSTS_DEPLOY_TO_ALGOLIA_ENDPOINT_PRODUCTION or BLOG_POSTS_DEPLOY_TO_ALGOLIA_ENDPOINT_DEVELOP environment variable not configured"
      );
    }

    try {
      await axios.post(API_ENDPOINT_DEVELOP, {
        newDocuments: newFilesData,
        updatedDocuments: modifiedFilesData,
        deletedDocuments: deletedFilesData,
      });
    } catch (error) {
      throw new Error(
        `Error sending posts to develop endpoint ${JSON.stringify(error)}`
      );
    }

    try {
      await axios.post(API_ENDPOINT_PRODUCTION, {
        newDocuments: newFilesData,
        updatedDocuments: modifiedFilesData,
        deletedDocuments: deletedFilesData,
      });
    } catch (error) {
      throw new Error(
        `Error sending posts to production endpoint ${JSON.stringify(error)}`
      );
    }

    console.log("Posts successfully sent to endpoints.");
  } catch (error) {
    console.error("Error generating or sending posts:", error);
  }
}

sendBlogsToAlgolia();
