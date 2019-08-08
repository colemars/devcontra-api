import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  console.log(process.env.tableName);
  console.log(process.env.bucketName);
  // const images = await snapshot(data.siteName, data.siteUserName);
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
