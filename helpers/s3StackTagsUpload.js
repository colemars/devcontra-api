/* eslint-disable camelcase */
import * as s3Lib from "../libs/dynamodb-lib";

const s3StackTagsUpload = async result => {
  const headParams = {
    Bucket: "stackOverflowTags"
  };
  const uploadParams = {
    ACL: "public-read",
    Body: result
  };

  const createParams = {
    Bucket: "stackOverflowTags",
    ACL: "public-read",
    CreateBucketConfiguration: {
      LocationConstraint: "us-west-2"
    }
  };

  try {
    const test = await s3Lib.call("headBucket", headParams);
    console.log(test);
    await s3Lib.call("createBucket", createParams);
    const test2 = await s3Lib.call("headBucket", headParams);
    console.log(test2);
    // await s3Lib.call("upload", uploadParams);
    return true;
  } catch (e) {
    console.log(e);
    return { error: e };
  }
};

export default s3StackTagsUpload;
