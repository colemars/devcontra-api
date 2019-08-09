import * as dynamoDbLib from "./libs/dynamodb-lib";
import s3Upload from "./helpers/upload-to-bucket";
import snapshot from "./helpers/snapshot";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  console.log(data);
  const siteName = "stackOverflow";
  const accountUrl =
    "https://stackoverflow.com/users/10606984/colemars?tab=questions";
  const site = data.siteName.toLowerCase();
  const url = data.url.toLowercase();

  await snapshot(site, url);
  const keys = await s3Upload();

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: data.userId,
      siteName: data.siteName,
      imageKeys: keys,
      createdAt: Date.now()
    }
  };

  try {
    const result = await dynamoDbLib.call("put", params);
    return success(result);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
