import { success, failure } from "./libs/response-lib";
import handleStackTags from "./helpers/handleStackTags";
import dynamoDbStackTagsUpload from "./helpers/dynamoDbStackTagsUpload";

export default async function main() {
  const { result, error } = await handleStackTags();
  if (error) return failure(error);
  try {
    await dynamoDbStackTagsUpload(result);
    return success(`tags populated`);
  } catch (err) {
    return failure(err);
  }
}
