/* eslint-disable camelcase */
import * as dynamoDbLib from "../libs/dynamodb-lib";

const dynamoDbStackTagsUpload = async result => {
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: "Admin",
      tags: result,
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

export default dynamoDbStackTagsUpload;
