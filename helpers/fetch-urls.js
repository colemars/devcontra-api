/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const fetchUrls = async (rootUrl, params, selectors, url) => {
  const questionUrls = [];
  for (const param of params) {
    const fetchUrl = url.concat(param);
    const response = await fetch(fetchUrl);
    const data = await response.text();
    const dom = await new JSDOM(data);
    const { document } = await dom.window;
    selectors.forEach(selector => {
      if (!document.querySelector(selector)) return;
      const aElements = document.querySelectorAll(selector);
      aElements.forEach(el => {
        console.log("fetch", el.href);
        return questionUrls.push(rootUrl.concat(el.href));
      });
    });
  }
  return questionUrls;
};

export default fetchUrls;
