import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  console.log(event);
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      siteName: event.pathParameters.site
    }
  };

  const result = await dynamoDbLib.call("get", params);
  if (result.Item) return success(result);
  return failure({ status: false });
}
