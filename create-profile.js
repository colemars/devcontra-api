import fs from "fs";
import util from "util";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import s3Upload from "./helpers/upload-to-bucket";
import snapshot from "./helpers/snapshot";
import { success, failure } from "./libs/response-lib";

const mkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);
const fsRmDir = util.promisify(fs.rmdir);

export default async function main(event) {
  const data = JSON.parse(event.body);
  const { userId } = data;
  const siteName = data.siteName.toLowerCase();
  const url = data.url.toLowerCase();

  try {
    await fsStat("/tmp/img");
    console.log("exists");
  } catch (e) {
    console.log("creating director");
    await mkdir("/tmp/img");
  }

  await snapshot(siteName, url);
  const keys = await s3Upload();

  try {
    await fsRmDir("/tmp/img");
  } catch (e) {
    console.log(e);
  }

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId,
      siteName,
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
