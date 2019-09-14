import fetch from "node-fetch";
import moment from "moment";
import parsePage from "./parsePage";
import getPage from "./getPage";

const handleStackOverflow = async targetUserId => {
  // const getPosts = `https://api.stackexchange.com/2.2/users/${targetUserId}/posts?order=desc&sort=activity&site=stackoverflow`;
  // const getUsername = `https://api.stackexchange.com/2.2/users/${targetUserId}?order=desc&sort=reputation&site=stackoverflow`;
  const now = moment();
  const toDate = now.clone().unix();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("isoweek")
    .unix();
  const getActivity = `https://api.stackexchange.com/2.2/users/${targetUserId}/timeline?pagesize=100&fromdate=${fromDate}&todate=${toDate}&site=stackoverflow`;
  // const selectors = {
  //   titleSelector: ".question-hyperlink",
  //   urlSelector: ".question-hyperlink",
  //   postSelector: ".post-layout",
  //   boolSelector: "question",
  //   postAuthorSelector: ".user-details a",
  //   bodySelector: ".post-text",
  //   commentsSelector: ".comment-body",
  //   commentAuthorSelector: ".comment-user",
  //   commentContentSelector: ".comment-copy",
  //   questionSelector: "#question",
  //   questionIdAttribute: "data-questionid"
  // };

  const jsonify = async target => {
    const result = await target.json();
    return result;
  };

  const [activityData] = await Promise.all([
    // jsonify(await fetch(getPosts)),
    // jsonify(await fetch(getUsername)),
    jsonify(await fetch(getActivity))
  ]);

  const activity = activityData.items;
  if (!activityData) return { error: "Invalid user id" };
  if (activity.length === 0)
    return { error: "This user has no posts to fetch" };

  activity.map(item => {
    const creationDate = moment.unix(item.creation_date);
    const begOfWeek = creationDate
      .clone()
      .startOf("isoWeek")
      .unix();
    // eslint-disable-next-line no-param-reassign
    item.activityDate = begOfWeek;
    return item;
  });
  return { response: activity };

  // try {
  //   const parsedPages = await Promise.all(
  //     posts.map(async post => {
  //       const postId = post.post_id;
  //       return parsePage(await getPage(postId), selectors, displayName);
  //     })
  //   );
  //   return { response: parsedPages };
  // } catch (err) {
  //   return { error: err };
  // }
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
