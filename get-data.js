/* eslint-disable prefer-destructuring */
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const { variant, accessKey } = event.pathParameters;
  let userId;

  const userParams = {
    TableName: process.env.usersTableName,
    IndexName: "accessKey-index",
    KeyConditionExpression: "accessKey = :accessKey",
    ExpressionAttributeValues: {
      ":accessKey": accessKey
    },
    Select: "ALL_PROJECTED_ATTRIBUTES"
  };

  try {
    console.log("here");
    const userResult = await dynamoDbLib.call("query", userParams);
    if (!userResult.Items.length > 0) {
      return failure({
        error: "User not found. Double check your profile key.",
        status: false
      });
    }
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
