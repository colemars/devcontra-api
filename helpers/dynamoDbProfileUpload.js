/* eslint-disable camelcase */
import { v4 } from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";

const dynamoDbProfileUpload = async (result, userId, variant, profileUrl) => {
  const { id, date, type } = result;

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId,
      activityId: id,
      variant,
      activityDate: date,
      type,
      profileUrl,
      accessKey: v4(),
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

export default dynamoDbProfileUpload;
