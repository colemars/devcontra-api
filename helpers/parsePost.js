const parsePost = (post, selectors, targetUsername) => {
  const {
    boolSelector,
    postAuthorSelector,
    bodySelector,
    commentsSelector,
    commentAuthorSelector,
    commentContentSelector
  } = selectors;

  const questionBool = post.parentElement.id === boolSelector;
  const body = post.querySelector(bodySelector);
  const author = post.querySelector(postAuthorSelector);
  const commentEls = post.querySelectorAll(commentsSelector);

  // sanity check
  if (!commentEls || !author || !body) return false;

  const comments = [];

  commentEls.forEach(el => {
    const commentBody = el.querySelector(commentContentSelector);
    const commentAuthor = el.querySelector(commentAuthorSelector);

    // sanity check
    if (!commentBody || !commentAuthor) return;

    comments.push({
      body: commentBody.textContent.trim(),
      author: commentAuthor.textContent.trim(),
      targetMatch: commentAuthor.textContent.trim() === targetUsername
    });
  });

  const parsedPost = {
    questionBool,
    body: body.textContent.trim(),
    author: author.textContent.trim(),
    comments,
    targetMatch: author.textContent.trim() === targetUsername
  };
  return parsedPost;
};

export default parsePost;
