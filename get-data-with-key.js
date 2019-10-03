/* eslint-disable prefer-destructuring */
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const { variant } = event.pathParameters;
  const { accessKey } = data;
  let userId;

  const userParams = {
    TableName: process.env.usersTableName,
    IndexName: "accessKey-index",
    KeyConditionExpression: "accessKey = :accessKey",
    ExpressionAttributeValues: {
      ":accessKey": accessKey
    },
    AttributesToGet: "userId",
    Select: "SPECIFIC_ATTRIBUTES"
  };

  try {
    console.log("here");
    const userResult = await dynamoDbLib.call("query", userParams);
    console.log(userResult);
    userId = userResult.Items[0].userId;
  } catch (e) {
    console.log("error:", e);
    return failure({ error: e, status: false });
  }

  const profileParams = {
    TableName: process.env.profilesTableName,
    IndexName: "userId-variant-index",
    KeyConditionExpression: "userId = :id and variant = :variant",
    ExpressionAttributeValues: {
      ":id": userId,
      ":variant": variant
    },
    Select: "ALL_PROJECTED_ATTRIBUTES"
  };

  try {
    console.log("there");
    const profile = await dynamoDbLib.call("query", profileParams);
    console.log(profile);
    if (profile.Items) {
      return success(profile.Items);
    }
    return success({ profile: "Not yet created" });
  } catch (e) {
    console.log("error:", e);
    return failure({ error: e, status: false });
  }
}
