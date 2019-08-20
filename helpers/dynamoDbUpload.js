import * as dynamoDbLib from "../libs/dynamodb-lib";

const dynamoDbUpload = async (
  pageResultsObject,
  userId,
  variant,
  profileUrl
) => {
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
