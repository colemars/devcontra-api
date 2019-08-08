/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteer from "puppeteer";
import filenamifyUrl from "filenamify-url";

const getUrls = async (siteName, siteUrl) => {
  console.log(process.env.tableName);
  console.log(process.env.bucketName);
  const iPhone = puppeteer.devices["iPhone X"];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const urlArray = [];
  await page.emulate(iPhone);
  await page.goto(
    "https://stackoverflow.com/users/10606984/colemars?tab=questions"
  );
  const hrefHandles = await page.$$("div.-details h2 a");
  for (const hrefHandle of hrefHandles) {
    urlArray.push(await page.evaluate(a => a.href, hrefHandle));
  }

  await page.goto(urlArray[0]);

  for (const url of urlArray) {
    console.log(url);
    await page.goto(url);
    const test = await page.screenshot({
      type: "jpeg",
      quality: 50,
      fullPage: true
    });
    console.log(test);
  }
  console.log("here");
  await browser.close();
};

export default getUrls;
