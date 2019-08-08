/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

  console.log("UPlOAD DONE", keys);

  return keys;
};

export default uploadFile;
