import * as dynamoDbLib from "./libs/dynamodb-lib";
import s3Upload from "./helpers/upload-to-bucket";
import snapshot from "./helpers/snapshot";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  console.log("run");
  // const data = JSON.parse(event.body);
  const siteName = "stackOverflow";
  const accountUrl = "https://stackoverflow.com/users/10606984/colemars?tab=questions";
  const images = await snapshot(siteName, accountUrl);
  console.log("out of snapshot");
  console.log("images", images);
  const imageKeys = await s3Upload(images);
  console.log("out of Upload");
  console.log("imageKeys", imageKeys);
  // const imageKeys = await uploadToBucket(images);

  // const params = {
  //   TableName: process.env.tableName,
  //   Item: {
  //     userId: data.userId,
  //     siteName: data.siteName,
  //     // imageKeys,
  //     createdAt: Date.now()
  //   }
  // };

  // try {
  //   const result = await dynamoDbLib.call("put", params);
  //   return success(result);
  // } catch (e) {
  //   console.log(e);
  //   return failure({ status: false });
  // }
}
