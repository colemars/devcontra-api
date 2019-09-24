import { success, failure } from "./libs/response-lib";
import handleStackTags from "./helpers/handleStackTags";
import s3StackTagsUpload from "./helpers/s3StackTagsUpload";

export default async function main() {
  const { result, error } = await handleStackTags();
  if (error) return failure(error);
  try {
    await s3StackTagsUpload(result);
    return success(`tags populated`);
  } catch (err) {
    return failure(err);
  }
}
