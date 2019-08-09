import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const fetchUrls = async (
  accountUrl = "https://stackoverflow.com/users/10606984/colemars?tab=answers"
) => {
  const baseUrl = "https://stackoverflow.com";
  const response = await fetch(accountUrl);
  const data = await response.text();
  const dom = await new JSDOM(data);
  const { document } = await dom.window;
  const aElements = document.querySelector(".question-hyperlink")
    ? document.querySelectorAll(".question-hyperlink")
    : document.querySelectorAll(".answer-hyperlink");
  const questionUrls = [];
  aElements.forEach(el => {
    questionUrls.push(baseUrl.concat(el.href));
  });
  return questionUrls;
};

export default fetchUrls;
