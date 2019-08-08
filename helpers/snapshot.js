/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteer from "puppeteer-core";
import fileNamifyUrl from "filenamify-url";

const chromium = require("chrome-aws-lambda");

const snapshot = async (siteName, accountUrl) => {
  console.log("SNAPSHOT RUN");
  console.log(accountUrl);
  // only stackOverFlow so far
  const urlArray = [];
  const fileArray = [];
  const iPhone = puppeteer.devices["iPhone X"];
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
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
    const buffer = await page.screenshot({
      type: "jpeg",
      quality: 50,
      fullPage: true
    });
    fileArray.push({ bufferBinary: buffer, fileName: fileNamifyUrl(url) });
  }
  await browser.close();
  console.log("SNAPSHOT DONE");
  return fileArray;
};

export default snapshot;
