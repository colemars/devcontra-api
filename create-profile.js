import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as handleTmpDir from "./helpers/handle-tmp-image-dir";
import uploadToBucket from "./helpers/upload-to-bucket";
import snapshot from "./helpers/snapshot";
import fetchUrls from "./helpers/fetch-urls";
import handleSiteConfig from "./helpers/handle-site-config";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const { userId } = data;
  const siteName = data.siteName.toLowerCase();
  const url = data.url.toLowerCase();

  const urlProps = await handleSiteConfig(url, siteName);
  if (urlProps.error) return failure(urlProps.error);

  const { root, urlParams, selectors } = urlProps;
  const urls = await fetchUrls(root, urlParams, selectors, url);
  console.log("done with fetch");

  handleTmpDir.create();
  await snapshot(urls);
  console.log("done with snapshot");
  const keys = await uploadToBucket();
  console.log("done with upload");
  handleTmpDir.remove();

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
