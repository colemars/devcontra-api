import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const getContent = async postId => {
  const getContentResponse = await fetch(
    `https://stackoverflow.com/questions/${postId}/`
  );
  const getContentData = await getContentResponse.text();
  return getContentData;
};

const parsePost = (post, selectors) => {
  const boolSelector = "question";
  const postAuthorSelector = ".user-details a";
  const bodySelector = ".post-text";
  const commentsSelector = ".comment-body";

  const questionBool = post.parentElement.id === boolSelector;
  const body = post.querySelector(bodySelector).innerText;
  const author = post.querySelector(postAuthorSelector);
  const commentEls = post.querySelectorAll(commentsSelector);
  const comments = [];

  commentEls.forEach(el => {
    const commentBody = el.querySelector(".comment-copy");
    const commentAuthor = el.querySelector(".comment-user");

    // sanity check
    if (!commentBody && !commentAuthor) return;

    comments.push({
      body: commentBody.innerText,
      author: commentAuthor.innerText
    });
  });

  const parsedPost = {
    questionBool,
    body,
    author,
    comments
  };

  return parsedPost;
};

const parsePage = async (page, selectors) => {
  const dom = await new JSDOM(page);
  const { document } = await dom.window;
  const titleSelector = ".question-hyperlink";
  const postSelector = ".post-layout";

  const questionTitle = document.querySelector(titleSelector);
  const posts = document.querySelectorAll(postSelector);

  // sanity check
  if (!questionTitle || !posts) return false;

  let question;
  const responses = [];

  posts.forEach(post => {
    const result = parsePost(post, selectors);
    const { questionBool, body, author, comments } = result;

    if (questionBool) {
      question = { title: questionTitle.innerText, body, author, comments };
      return;
    }
    responses.push({ body, author, comments });
  });

  return { question, responses };
};

const handleStackOverflow = async siteUserId => {
  console.log("in stack");
  const userUrl = `https://api.stackexchange.com/2.2/users/${siteUserId}/posts?order=desc&sort=activity&site=stackoverflow`;

  const response = await fetch(userUrl);
  const data = await response.json();
  const posts = data.items;

  const contentResults = await Promise.all(
    posts.map(post => getPage(post.post_id))
  );
  const parsedPages = await Promise.all(
    contentResults.map(result => parsePage(result))
  );

  return parsedPages;
};

const handleSpectrum = siteUserId => {};
const handleTwitter = siteUserId => {};
const handleGithub = siteUserId => {};

const handleSiteName = async (siteName, siteUserId) => {
  if (siteName === "stackoverflow") return handleStackOverflow(siteUserId);
  if (siteName === "spectrum") return handleSpectrum(siteUserId);
  if (siteName === "twitter") return handleTwitter(siteUserId);
  if (siteName === "github") return handleGithub(siteUserId);
  return { error: "not a valid site" };
};

export default async function main(event) {
  // const data = JSON.parse(event.body);
  // const { userId } = event.requestContext.identity.cognitoIdentityId;
  // const siteName = data.siteName.toLowerCase();
  // const siteUserId = data.siteId.toLowerCase();
  const siteName = "stackoverflow";
  const siteUserId = "10606984";

  const results = await handleSiteName(siteName, siteUserId);

  // const urlProps = await handleSiteConfig(url, siteName);
  // if (urlProps.error) return failure(urlProps.error);

  // const { root, urlParams, selectors } = urlProps;
  // const urls = await fetchUrls(root, urlParams, selectors, url);
  // if (urls.error) return failure(urls.error);

  return success();
}

main();
