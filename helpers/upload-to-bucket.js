/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";
import util from "util";

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

const uploadFile = async () => {
  const keys = [];
  const files = [];
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  const directoryPath = "/tmp/img/";
  const listedFiles = await readdir(directoryPath);

  const deleteLocalFile = async file => {
    await unlink(path.join(`${directoryPath}`, `${file.name}`), err => {
      if (err) {
        console.log(`failed to delete local image:${err}`);
      } else {
        console.log("successfully deleted local image");
      }
    });
  };

  for (const file of listedFiles) {
    try {
      files.push({
        data: await readFile(path.join(directoryPath, `/${file}`)),
        name: file
      });
    } catch (err) {
      console.log(err);
    }
  }

  for (const file of files) {
    const params = {
      Bucket:
        process.env.BUCKET_NAME ||
        "devcontra-api-dev-attachmentsbucket-sse4szutsuon",
      Key: file.name,
      Body: file.data
    };
    try {
      const stored = await s3.upload(params).promise();
      keys.push(stored.key);
      await deleteLocalFile(file);
    } catch (err) {
      console.log(err);
    }
  }

  console.log(keys);
  return keys;
};

export default uploadFile;
