/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteer from "puppeteer-core";
import fileNamifyUrl from "filenamify-url";
import chromium from "chrome-aws-lambda";

const screenshot = async (page, urls) => {
  for (const url of urls) {
    console.log("url", url);
    await page.goto(url);
    await page.screenshot({
      path: `/tmp/img/${fileNamifyUrl(url)}.png`,
      fullPage: true
    });
  }
  return true;
};

const snapshot = async urls => {
  const iPad = puppeteer.devices["iPad Pro"];
  console.log("launch browser");
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  const page = await browser.newPage();
  await page.emulate(iPad);
  await screenshot(page, urls);
  console.log("close browser");
  await browser.close();
  return true;
};

export default snapshot;
