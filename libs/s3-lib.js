/* eslint-disable import/prefer-default-export */
import { S3 } from "aws-sdk";

export function call(action, params) {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  return s3[action](params).promise();
}