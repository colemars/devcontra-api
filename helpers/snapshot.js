/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteerLambda from "puppeteer-lambda";
import puppeteer from "puppeteer";

const snapshot = async (siteName, accountUrl) => {
  console.log("SNAPSHOT RUN");
  console.log(accountUrl);
  // only stackOverFlow so far
  const urlArray = [];
  const imageArray = [];
  const iPhone = puppeteer.devices["iPhone X"];
  const browser = await puppeteerLambda.getBrowser({
    headless: true
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto(accountUrl);
  const hrefHandles = await page.$$("div.-details h2 a");

  console.log("handles", hrefHandles);

  for (const hrefHandle of hrefHandles) {
    urlArray.push(await page.evaluate(a => a.href, hrefHandle));
  }

  for (const url of urlArray) {
    console.log(url);
    await page.goto(url);
    const image = await page.screenshot({
      type: "jpeg",
      quality: 50,
      fullPage: true
    });
    imageArray.push(image);
  }
  await browser.close();
  console.log("SNAPSHOT DONE");
  return imageArray;
};

snapshot(
  "test",
  "https://stackoverflow.com/users/10606984/colemars?tab=questions"
);

export default snapshot;
