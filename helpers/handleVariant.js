import fetch from "node-fetch";
import moment from "moment";

const handleStackOverflow = async targetUserId => {
  const now = moment();
  const toDate = now.clone().unix();
  const fromDate = now
    .clone()
    .subtract(17, "weeks")
    .startOf("isoweek")
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
