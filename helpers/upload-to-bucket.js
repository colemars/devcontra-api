/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { success, failure } from "../libs/response-lib";
import s3 from "../libs/s3-lib";

const uploadFile = async fileArray => {
  console.log("INSIDE UPLOADFILE");
  const keys = [];
  for (const file of fileArray) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.fileName,
      Body: file.bufferBinary
    };

    const storedKey = await s3.upload(params);
    keys.push(storedKey);
    }
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
