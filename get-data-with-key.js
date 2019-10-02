import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  console.log("hit");
  const data = JSON.parse(event.body);
  const { variant } = event.pathParameters;
  const { accessKey } = data;

  const params = {
    TableName: process.env.tableName,
    IndexName: "variant-accessKey-index",
    KeyConditionExpression: "variant = :variant and accessKey = :accessKey",
    ExpressionAttributeValues: {
      ":variant": variant,
      ":accessKey": accessKey
    },
    Select: "ALL_PROJECTED_ATTRIBUTES"
  };

  try {
    const profile = await dynamoDbLib.call("query", params);
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
