/* eslint-disable no-restricted-syntax */
import s3 from "../libs/s3-lib";
import { success, failure } from "../libs/response-lib";

const uploadFile = async images => {
  console.log("INSIDE UPLOADFILE");
  for (const image of images) {
    console.log(image);
  }

  // const params = {
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: fileName,
  //   Body: data
  // };

  // try {
  //   const result = await s3.upload(params);
  //   console.log(result);
  //   return success(result);
  // } catch (e) {
  //   console.log(e);
  //   return failure({ status: false });
  // }
  console.log("UPlOAD DONE");
  return "testKey";
};

export default uploadFile;
