import { JSDOM } from "jsdom";
import parsePost from "./parsePost";

const parsePage = async (page, selectors, targetUsername) => {
  const dom = await new JSDOM(page);
  const { document } = await dom.window;
  const {
    titleSelector,
    urlSelector,
    postSelector,
    questionSelector,
    questionIdAttribute
  } = selectors;

  const questionEl = document.querySelector(questionSelector);
  const id = Number(questionEl.getAttribute(questionIdAttribute));
  const title = document.querySelector(titleSelector);
  const url = document.querySelector(urlSelector);
  const posts = document.querySelectorAll(postSelector);

  // sanity check
  if (!id || !title || !posts || !url) return false;

  let question;
  const responses = [];

  posts.forEach(post => {
    const result = parsePost(post, selectors, targetUsername);
    const { questionBool, body, author, comments, targetMatch } = result;

    if (questionBool) {
      question = {
        id,
        url: url.href,
        title: title.textContent.trim(),
        body,
        author,
        comments,
        targetMatch
      };
      return;
    }
    responses.push({ body, author, comments });
  });
  return { question, responses };
};

export default parsePage;
