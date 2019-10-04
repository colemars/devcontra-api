import { success, failure } from "./libs/response-lib";
import dynamoDbUserUpload from "./helpers/dynamoDbUserUpload";

export default async function main(event) {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUserId = parts[parts.length - 1];

  const user = await dynamoDbUserUpload(userPoolUserId);

  console.log(user);

  if (!user)
    // TO DO build error parser;
    return failure("user not created");
  return success(`user created`);
}
