/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fileNamifyUrl from "filenamify-url";
import captureWebsite from "capture-website";

const snapshot = async urls => {
  const items = [];
  urls.forEach(url => {
    items.push([url, `${fileNamifyUrl(url)}`]);
  });
  console.log("items", items);
  await Promise.all(
    items.map(([url, filename]) => {
      return captureWebsite.file(url, `/tmp/img/${filename}.png`, {
        emulateDevice: "iPad Pro",
        fullPage: true
      });
    })
  );
};

export default snapshot;
