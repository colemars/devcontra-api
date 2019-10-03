import { v4 } from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";

const dynamoDbUserUpload = async userId => {
  const params = {
    TableName: process.env.usersTableName,
    Item: {
      userId,
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

export default dynamoDbUserUpload;
