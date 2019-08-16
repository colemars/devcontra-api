import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const dynamoDbUpload = async (pageResultsObject, userId, variant) => {
  const { question, responses } = pageResultsObject;
  const { url, title, body, author, comments } = question;
  console.log(userId);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId,
      variant,
      url,
      title,
      body,
      author,
      comments,
      responses,
      createdAt: Date.now()
    }
  };

  try {
    const result = await dynamoDbLib.call("put", params);
    console.log(result);
    return success(result);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};

const getPage = async postId => {
  const getPageResponse = await fetch(
    `https://stackoverflow.com/questions/${postId}/`
  );
  const getPageData = await getPageResponse.text();
  return getPageData;
};

const parsePost = (post, selectors, targetUsername) => {
  const boolSelector = "question";
  const postAuthorSelector = ".user-details a";
  const bodySelector = ".post-text";
  const commentsSelector = ".comment-body";

  const questionBool = post.parentElement.id === boolSelector;
  const body = post.querySelector(bodySelector);
  const author = post.querySelector(postAuthorSelector);
  const commentEls = post.querySelectorAll(commentsSelector);

  // sanity check
  if (!commentEls || !author || !body) return false;

  const comments = [];

  commentEls.forEach(el => {
    const commentBody = el.querySelector(".comment-copy");
    const commentAuthor = el.querySelector(".comment-user");

    // sanity check
    if (!commentBody || !commentAuthor) return;

    comments.push({
      body: commentBody.textContent.trim(),
      author: commentAuthor.textContent.trim(),
      targetMatch: author === targetUsername
    });
  });

  const parsedPost = {
    questionBool,
    body: body.textContent.trim(),
    author: author.textContent.trim(),
    comments,
    targetMatch: author === targetUsername
  };

  return parsedPost;
};

const parsePage = async (page, selectors, targetUsername) => {
  const dom = await new JSDOM(page);
  const { document } = await dom.window;
  const titleSelector = ".question-hyperlink";
  const urlSelector = ".question-hyperlink";
  const postSelector = ".post-layout";

  const questionTitle = document.querySelector(titleSelector);
  const url = document.querySelector(urlSelector);
  const posts = document.querySelectorAll(postSelector);

  // sanity check
  if (!questionTitle || !posts || !url) return false;

  let question;
  const responses = [];

  posts.forEach(post => {
    const result = parsePost(post, selectors, targetUsername);
    const { questionBool, body, author, comments, targetMatch } = result;

    if (questionBool) {
      question = {
        url: url.href,
        title: questionTitle.textContent.trim(),
        body,
        author,
        comments,
        targetMatch
      };
      return;
    }
    responses.push({ body, author, comments });
  });

  return { question, responses };
};

const handleStackOverflow = async targetUserId => {
  // promise.all convert
  console.log("in stack");
  console.log(targetUserId);
  const getPosts = `https://api.stackexchange.com/2.2/users/${targetUserId}/posts?order=desc&sort=activity&site=stackoverflow`;
  const getUsername = `https://api.stackexchange.com/2.2/users/${targetUserId}?order=desc&sort=reputation&site=stackoverflow`;

  const postsObject = await fetch(getPosts);
  const postsData = await postsObject.json();
  const posts = postsData.items;

  const userObject = await fetch(getUsername);
  const userData = await userObject.json();

  // ERROR POINT
  console.log(userData);
  console.log(userData.items);
  const displayName = userData.items[0].display_name;

  if (!userObject || !displayName) return { error: "Invalid user id" };
  if (posts.length === 0) return { error: "This user has no posts to fetch" };

  try {
  const contentResults = await Promise.all(
    posts.map(post => getPage(post.post_id))
  );
  const parsedPages = await Promise.all(
      contentResults.map(result => parsePage(result, displayName))
  );
    return { response: parsedPages };
  } catch (err) {
    return { error: err };
  }
};

const handleSpectrum = targetUserId => {};
const handleTwitter = targetUserId => {};
const handleGithub = targetUserId => {};

const handleVariant = async (variant, targetUserId) => {
  if (variant === "stackoverflow") return handleStackOverflow(targetUserId);
  if (variant === "spectrum") return handleSpectrum(targetUserId);
  if (variant === "twitter") return handleTwitter(targetUserId);
  if (variant === "github") return handleGithub(targetUserId);
  return { error: "not a valid site" };
};

export default async function main(event) {
  const data = JSON.parse(event.body);
  const { userId } = event.requestContext.identity.cognitoIdentityId;
  const { variant, targetUserId } = data;

  const { response, error } = await handleVariant(variant, targetUserId);

  if (error) return failure(error);
  console.log(userId);
  try {
  const upload = await Promise.all(
      response.map(result => dynamoDbUpload(result, userId, variant))
  );
    return upload;
  } catch (err) {
    return failure(err);
  }
}
