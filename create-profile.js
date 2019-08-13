import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as handleTmpDir from "./helpers/handle-tmp-image-dir";
import uploadToBucket from "./helpers/upload-to-bucket";
import snapshot from "./helpers/snapshot";
import fetchUrls from "./helpers/fetch-urls";
import handleSiteConfig from "./helpers/handle-site-config";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const { userId } = event.requestContext.identity.cognitoIdentityId;
  const siteName = data.siteName.toLowerCase();
  const url = data.url.toLowerCase();

  const urlProps = await handleSiteConfig(url, siteName);
  if (urlProps.error) return failure(urlProps.error);

  const { root, urlParams, selectors } = urlProps;
  const urls = await fetchUrls(root, urlParams, selectors, url);
  if (urls.error) return failure(urls.error);

  await handleTmpDir.create();
  await snapshot(urls);

  const keys = await uploadToBucket();
  await handleTmpDir.remove();

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
