/* eslint-disable camelcase */
import * as dynamoDbLib from "../libs/dynamodb-lib";

const dynamoDbUpload = async (result, userId, variant, profileUrl) => {
  const {
    timeline_type,
    creation_date,
    detail,
    title,
    post_type,
    comment_id,
    post_id
  } = result;

  const nonPost = 100;

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId,
      timelineType: timeline_type,
      variant,
      creationDate: creation_date,
      title,
      detail,
      postType: post_type,
      commentId: comment_id,
      postId: post_id || nonPost,
      profileUrl,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return true;
  } catch (e) {
    console.log(e);
    return { error: e };
  }
};

export default dynamoDbUpload;
