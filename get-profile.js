import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUserId = parts[parts.length - 1];
  const data = JSON.parse(event.body);
  const { variant } = data;

  const params = {
    TableName: process.env.tableName,
    IndexName: "userId-variant-index",
    KeyConditionExpression: "userId = :id and variant = :variant",
    ExpressionAttributeValues: {
      ":id": userPoolUserId,
      ":variant": variant
    },
    Select: "ALL_PROJECTED_ATTRIBUTES"
  };
  try {
    const profile = await dynamoDbLib.call("query", params);
    if (profile.Items) {
      return success(profile.Items);
    }
    return success({ profile: "Not yet created" });
  } catch (e) {
    return failure({ error: e, status: false });
  }
}
