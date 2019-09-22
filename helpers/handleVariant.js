/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import fetch from "node-fetch";
import moment from "moment";
import crypto from "crypto";
import oauthSignatureGenerator from "oauth-signature";

const constructReturnObject = (id, date, type) => {
  return {
    id,
    date,
    type
  };
};

const jsonify = async target => {
  const result = await target.json();
  return result;
};

const handleStackOverflow = async url => {
  const now = moment().utc();
  const toDate = now.clone().unix();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("week")
    .unix();
  const targetUserId = url.split("/")[4];
  const getActivity = `https://api.stackexchange.com/2.2/users/${targetUserId}/timeline?pagesize=100&fromdate=${fromDate}&todate=${toDate}&site=stackoverflow`;

  const [activity] = await Promise.all([
    // jsonify(await fetch(getActivity)),
    // jsonify(await fetch(getActivity)),
    jsonify(await fetch(getActivity))
  ]);

  if (!activity.items) return { error: "Invalid user id" };

  const returnObject = activity.items.map(item => {
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

const handleTwitter = async url => {
  const method = "GET";
  const baseUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json";

  const oAuthConsumerKey = "YqQe0yPHp3E2I701QLU6q3euc";
  const oAuthToken = "4908297532-SSzdTBfxkZVKq1xqKSrXj4SEUvCG5wvRSO2V29Y";
  const oAuthNonce = crypto.randomBytes(32).toString("base64");
  const oAuthTimeStamp = moment()
    .utc()
    .unix();
  const oAuthSignatureMethod = "HMAC-SHA1";
  const oAuthVersion = "1.0";
  const userId = url.split("/")[3];
  const count = 200;
  const includeRts = 1;

  const oAuthConsumerSecret =
    "m4YRYyxp2TBnpxbOUt1x2HOjCKgh29IkdTd1kHzMuHZIFgOwtQ";
  const oAuthAccessTokenSecret =
    "CYNTng2wZWxhp8fcHot3qxPMwOza8YXxJqFlwktaZgI13";

  const params = {
    oauth_consumer_key: oAuthConsumerKey,
    oauth_token: oAuthToken,
    oauth_nonce: oAuthNonce,
    oauth_timestamp: oAuthTimeStamp,
    oauth_signature_method: oAuthSignatureMethod,
    oauth_version: oAuthVersion,
    user_id: userId,
    include_rts: includeRts,
    count
  };

  const oAuthSignature = oauthSignatureGenerator.generate(
    method,
    baseUrl,
    params,
    oAuthConsumerSecret,
    oAuthAccessTokenSecret
  );

  const escapedNonce = encodeURIComponent(oAuthNonce);

  const getActivity = `https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&include_rts=1&oauth_consumer_key=${oAuthConsumerKey}&oauth_nonce=${escapedNonce}&oauth_signature_method=${oAuthSignatureMethod}&oauth_timestamp=${oAuthTimeStamp}&oauth_token=${oAuthToken}&oauth_version=${oAuthVersion}&user_id=${userId}&oauth_signature=${oAuthSignature}`;

  const activity = await jsonify(await fetch(getActivity));

  const returnObject = activity.map(item => {
    const { created_at, id } = item;
    const twitterDateFormat = "dd MMM DD HH:mm:ss ZZ YYYY";
    const creationDate = moment(created_at, twitterDateFormat, "en");
    const begOfWeek = creationDate
      .clone()
      .startOf("week")
      .unix();
    item.activityDate = begOfWeek;
    return constructReturnObject(id, begOfWeek, "tweet");
  });
  return { response: returnObject };
};

const handleGithub = async url => {
  const now = moment().utc();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("week")
    .format("YYYY-MM-DD");
  const targetUserId = url.split("/")[3];
  const getCommitActivity = `https://api.github.com/search/commits?q=author:${targetUserId}+committer-date:>=${fromDate}`;
  const getPRActivity = `https://api.github.com/search/issues?q=author:${targetUserId}+type:pr+created:>=${fromDate}`;
  const getIssueActivity = `https://api.github.com/search/issues?q=author:${targetUserId}+type:issue+created:>=${fromDate}`;

  const options = {
    headers: { Accept: "application/vnd.github.cloak-preview" }
  };

  const [commits, issues, pullRequests] = await Promise.all([
    jsonify(await fetch(getCommitActivity, options)),
    jsonify(await fetch(getIssueActivity, options)),
    jsonify(await fetch(getPRActivity, options))
  ]);

  if (!commits.items || !issues.items || !pullRequests.items)
    return { error: "Invalid user id" };

  commits.items.map(type => {
    type.type = "commit";
    type.created_at = type.commit.committer.date;
    return type;
  });

  issues.items.map(type => {
    type.type = "issue";
    return type;
  });

  pullRequests.items.map(type => {
    type.type = "pr";
    return type;
  });

  const activity = [].concat(
    ...[commits.items, issues.items, pullRequests.items]
  );

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
