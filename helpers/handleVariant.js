import fetch from "node-fetch";
import parsePage from "./parsePage";
import getPage from "./getPage";

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

export default handleVariant;
