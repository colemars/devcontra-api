/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import fetch from "node-fetch";
import moment from "moment";

const constructReturnObject = (id, date, type) => {
  return {
    id,
    date,
    type
  };
};

const handleStackOverflow = async targetUserId => {
  const now = moment().utc();
  const toDate = now.clone().unix();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("week")
    .unix();
  const getActivity = `https://api.stackexchange.com/2.2/users/${targetUserId}/timeline?pagesize=100&fromdate=${fromDate}&todate=${toDate}&site=stackoverflow`;

  const jsonify = async target => {
    const result = await target.json();
    return result;
  };

  const [activityData] = await Promise.all([
    // jsonify(await fetch(getActivity)),
    // jsonify(await fetch(getActivity)),
    jsonify(await fetch(getActivity))
  ]);

  if (!activityData) return { error: "Invalid user id" };
  const activity = activityData.items;
  if (activity.length === 0)
    return { error: "This user has no posts to fetch" };

  const returnObject = activity.map(item => {
    const { creation_date, timeline_type } = item;
    const creationDate = moment.unix(creation_date);
    const begOfWeek = creationDate
      .clone()
      .startOf("week")
      .unix();
    return constructReturnObject(creation_date, begOfWeek, timeline_type);
  });
  return { response: returnObject };
};

const handleSpectrum = targetUserId => {};
const handleTwitter = targetUserId => {};
const handleGithub = async targetUserId => {
  const now = moment().utc();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("week")
    .format("YYYY-MM-DD");

  const getCommitActivity = `https://api.github.com/search/commits?q=author:${targetUserId}+committer-date:>=${fromDate}`;
  const getPRActivity = `https://api.github.com/search/issues?q=author:${targetUserId}+type:pr+created:>=${fromDate}`;
  const getIssueActivity = `https://api.github.com/search/issues?q=author:${targetUserId}+type:issue+created:>=${fromDate}`;

  const jsonify = async target => {
    const result = await target.json();
    return result.items;
  };

  const options = {
    headers: { Accept: "application/vnd.github.cloak-preview" }
  };

  const [commits, issues, pullRequests] = await Promise.all([
    jsonify(await fetch(getCommitActivity, options)),
    jsonify(await fetch(getIssueActivity, options)),
    jsonify(await fetch(getPRActivity, options))
  ]);

  commits.map(type => {
    type.type = "commit";
    type.created_at = type.commit.committer.date;
    return type;
  });

  issues.map(type => {
    type.type = "issue";
    return type;
  });

  pullRequests.map(type => {
    type.type = "pr";
    return type;
  });

  const activity = [].concat(...[commits, issues, pullRequests]);

  const returnObject = activity.map(item => {
    const { created_at, type } = item;
    const creationDate = moment(created_at);
    const begOfWeek = creationDate
      .clone()
      .startOf("week")
      .unix();
    item.activityDate = begOfWeek;
    return constructReturnObject(creationDate.unix(), begOfWeek, type);
  });
  return { response: returnObject };
};

const handleVariant = async (variant, targetUserId) => {
  if (variant === "stackoverflow") return handleStackOverflow(targetUserId);
  if (variant === "spectrum") return handleSpectrum(targetUserId);
  if (variant === "twitter") return handleTwitter(targetUserId);
  if (variant === "github") return handleGithub(targetUserId);
  return { error: "not a valid site" };
};

export default handleVariant;
