import fs from "fs";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const params = {
  Bucket: "bucket",
  Key: "key",
  Body: stream
};

s3.upload(params, function(err, data) {
  console.log(err, data);
});
