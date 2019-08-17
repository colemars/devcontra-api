import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const dynamoDbUpload = async (pageResultsObject, userId, variant) => {
  const { question, responses } = pageResultsObject;
  const { url, title, body, author, comments, id, targetMatch } = question;

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId,
      postId: id,
      variant,
      url,
      title,
      body,
      author,
      comments,
      responses,
      targetMatch,
      createdAt: Date.now()
    }
  };

  try {
    const result = await dynamoDbLib.call("put", params);
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
  const {
    boolSelector,
    postAuthorSelector,
    bodySelector,
    commentsSelector,
    commentAuthorSelector,
    commentContentSelector
  } = selectors;

  const questionBool = post.parentElement.id === boolSelector;
  const body = post.querySelector(bodySelector);
  const author = post.querySelector(postAuthorSelector);
  const commentEls = post.querySelectorAll(commentsSelector);

  // sanity check
  if (!commentEls || !author || !body) return false;

  const comments = [];

  commentEls.forEach(el => {
    const commentBody = el.querySelector(commentContentSelector);
    const commentAuthor = el.querySelector(commentAuthorSelector);

    // sanity check
    if (!commentBody || !commentAuthor) return;

    comments.push({
      body: commentBody.textContent.trim(),
      author: commentAuthor.textContent.trim(),
      targetMatch: commentAuthor.textContent.trim() === targetUsername
    });
  });

  const parsedPost = {
    questionBool,
    body: body.textContent.trim(),
    author: author.textContent.trim(),
    comments,
    targetMatch: author.textContent.trim() === targetUsername
  };
  return parsedPost;
};

const parsePage = async (page, selectors, targetUsername) => {
  const dom = await new JSDOM(page);
  const { document } = await dom.window;
  const {
    titleSelector,
    urlSelector,
    postSelector,
    questionSelector,
    questionIdAttribute
  } = selectors;

  const questionEl = document.querySelector(questionSelector);
  const id = questionEl.getAttribute(questionIdAttribute);
  const title = document.querySelector(titleSelector);
  const url = document.querySelector(urlSelector);
  const posts = document.querySelectorAll(postSelector);

  // sanity check
  if (!id || !title || !posts || !url) return false;

  let question;
  const responses = [];

  posts.forEach(post => {
    const result = parsePost(post, selectors, targetUsername);
    const { questionBool, body, author, comments, targetMatch } = result;

    if (questionBool) {
      question = {
        id,
        url: url.href,
        title: title.textContent.trim(),
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
  const getPosts = `https://api.stackexchange.com/2.2/users/${targetUserId}/posts?order=desc&sort=activity&site=stackoverflow`;
  const getUsername = `https://api.stackexchange.com/2.2/users/${targetUserId}?order=desc&sort=reputation&site=stackoverflow`;
  const selectors = {
    titleSelector: ".question-hyperlink",
    urlSelector: ".question-hyperlink",
    postSelector: ".post-layout",
    boolSelector: "question",
    postAuthorSelector: ".user-details a",
    bodySelector: ".post-text",
    commentsSelector: ".comment-body",
    commentAuthorSelector: ".comment-user",
    commentContentSelector: ".comment-copy",
    questionSelector: "#question",
    questionIdAttribute: "data-questionid"
  };

  const jsonify = async target => {
    const result = await target.json();
    return result;
  };

  const [postsData, userData] = await Promise.all([
    jsonify(await fetch(getPosts)),
    jsonify(await fetch(getUsername))
  ]);

  const posts = postsData.items;

  const displayName = userData.items[0].display_name;

  if (!userData || !displayName) return { error: "Invalid user id" };
  if (posts.length === 0) return { error: "This user has no posts to fetch" };

  try {
    const parsedPages = await Promise.all(
      posts.map(async post => {
        const postId = post.post_id;
        return parsePage(await getPage(postId), selectors, displayName);
      })
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
  const userId = event.requestContext.identity.cognitoIdentityId;
  const { variant, targetUserId } = data;

  console.log(targetUserId, variant);

  const { response, error } = await handleVariant(variant, targetUserId);
  console.log(response);
  if (error) return failure(error);

  try {
    const upload = await Promise.all(
      response.map(result => dynamoDbUpload(result, userId, variant))
    );
    console.log(upload);
    return upload;
  } catch (err) {
    return failure(err);
  }
}
