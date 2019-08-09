import fs from "fs";
import util from "util";

const mkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);
const fsRmDir = util.promisify(fs.rmdir);

export const create = async () => {
  try {
    console.log("checking if dir exists...");
    await fsStat("/tmp/img");
    console.log("dir exists");
  } catch (e) {
    console.log("creating dir");
    await mkdir("/tmp/img");
  }
};

export const remove = async () => {
  try {
    console.log("removing temp img dir...");
    await fsRmDir("/tmp/img");
    console.log("dir removed");
  } catch (e) {
    console.log("remove failed", e);
  }
};
