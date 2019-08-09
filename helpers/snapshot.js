/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteer from "puppeteer-core";
import fileNamifyUrl from "filenamify-url";
import chromium from "chrome-aws-lambda";

const snapshotStackOverflow = async baseUrl => {
  const urlArray = [];
  const iPad = puppeteer.devices["iPad Pro"];
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  const page = await browser.newPage();
  await page.emulate(iPad);
  await page.goto(baseUrl);
  let hrefHandles = await page.$$(".question-hyperlink");
  if (hrefHandles.length === 0)
    hrefHandles = await page.$$(".answer-hyperlink");
  if (hrefHandles.length === 0) {
    console.log("false");
    browser.close();
    return false;
  }

  console.log("handles", hrefHandles);

  for (const hrefHandle of hrefHandles) {
    urlArray.push(await page.evaluate(a => a.href, hrefHandle));
  }

  for (const url of urlArray) {
    console.log(url);
    await page.goto(url);
    await page.screenshot({
      path: `/tmp/img/${fileNamifyUrl(url)}.png`,
      fullPage: true
    });
  }
  await browser.close();
  return true;
};

const snapshot = async (siteName, url) => {
  if (url.includes("stackoverflow")) {
    await snapshotStackOverflow(url.concat("?tab=questions"));
    await snapshotStackOverflow(url.concat("?tab=answers"));
    return true;
  }
  console.log("this site may not be a valid site");
  return false;
};

export default snapshot;
