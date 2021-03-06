/* eslint-disable camelcase */
import fetch from "node-fetch";

const jsonify = async target => {
  const result = await target.json();
  return result;
};

const buildTags = async (page, tags) => {
  const getTags = `https://api.stackexchange.com/2.2/tags?page=${page}&pagesize=100&order=desc&sort=popular&site=stackoverflow`;
  const { items, error_name, quota_remaining, has_more } = await jsonify(
    await fetch(getTags)
  );
  if (!items) return { error: error_name };
  tags.push(items);
  if (quota_remaining === 0) return { result: tags };
  if (has_more) return buildTags(page + 1, tags);
  const flattenedTags = [].concat.apply([], [...tags]);
  const surfacedTags = flattenedTags.map(item => item.name);

  return { result: surfacedTags };
};

const handleStackTags = async () => {
  const { result, error } = await buildTags(1, []);
  if (error) return { error };
  return { result };
};

handleStackTags();

export default handleStackTags;
