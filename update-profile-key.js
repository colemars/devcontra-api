import { v4 } from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUserId = parts[parts.length - 1];

  const newKey = v4();

  const params = {
    TableName: process.env.tableName,
    IndexName: "userId-variant-index",
    Key: {
      userId: userPoolUserId,
      activityId: 123
    },
    UpdateExpression: "SET accessKey = :accessKey",
    ExpressionAttributeValues: {
      ":accessKey": v4()
    },
    ReturnValues: "UPDATED_NEW"
  };
  console.log(newKey);
  console.log(userPoolUserId);
  console.log(params);

  try {
    const result = await dynamoDbLib.call("update", params);
    console.log(result);
    return success(result);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
