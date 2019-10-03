import { v4 } from "uuid";
import { success, failure } from "./libs/response-lib";
import handleVariant from "./helpers/handleVariant";
import dynamoDbProfileUpload from "./helpers/dynamoDbProfileUpload";
import * as dynamoDbLib from "./libs/dynamodb-lib";

export default async function main(event) {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUserId = parts[parts.length - 1];
  const data = JSON.parse(event.body);
  const { variant, profileUrl } = data;
  console.log(profileUrl, variant);
  const { response, error } = await handleVariant(variant, profileUrl);
  if (error) return failure(error);

  const profileUpload = await Promise.all(
    response.map(result =>
      dynamoDbProfileUpload(result, userPoolUserId, variant, profileUrl)
    )
  );

  const params = {
    TableName: process.env.usersTableName,
    Item: {
      userPoolUserId,
      accessKey: v4(),
      createdAt: Date.now()
    }
  };

  await dynamoDbLib.call("put", params);

  if (!profileUpload.every(item => item === true))
    // TO DO build error parser;
    return failure(profileUpload.map(item => item.error));
  return success(`${variant} profile created`);
}
